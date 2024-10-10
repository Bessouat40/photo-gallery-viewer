from elasticsearch import Elasticsearch
import warnings
import torch
import base64
import numpy as np
import open_clip
from elasticLibrary.image_processor import ImageProcessor

class ElasticsearchManager:
    _instance = None

    def __new__(cls, host, port):
        if cls._instance is None:
            cls._instance = super(ElasticsearchManager, cls).__new__(cls)
            cls._instance.client = Elasticsearch(f"http://{host}:{port}")
            cls._instance.model, _, cls._instance.preprocess = open_clip.create_model_and_transforms('ViT-B-32', pretrained='laion2b_s34b_b79k')
            cls._instance.tokenizer = open_clip.get_tokenizer('ViT-B-32')
            cls._instance.processor = ImageProcessor()
        return cls._instance

    def __init__(self, host, port):
        self.nbr_insert = 0

    def get_last_document_id(self):
        if not self.client.indices.exists(index="document"):
            return 0
        search_body = {
            "query": {"match_all": {}},
            "sort": [{"document_id": {"order": "desc"}}],
            "size": 1
        }
        response = self.client.search(index="document", body=search_body)
        if response["hits"]["total"]["value"] > 0:
            last_image = response["hits"]["hits"][0]
            last_image_id = last_image["_source"]["document_id"]
            return last_image_id + 1
        else:
            return 0

    def index_document(self, document_id, elastic_file_path, clip_embedding, extension):
        if extension.upper() == 'JPG' : 
            extension = 'jpeg'
        try:
            doc = {
                "document_id": document_id,
                "elastic_file_path": elastic_file_path,
                "clip_embedding": clip_embedding,
                "extension": extension
            }
            self.client.index(index="document", id=document_id, body=doc)
            self.nbr_insert += 1
        except Exception as e:
            warnings.warn(f"Error occurred: {e}")

    def search_documents(self, query_body):
        return self.client.search(index="document", body=query_body)
    
    def reset_inserts(self):
        self.nbr_insert = 0

    def find_similarity(self, text):
        torch.manual_seed(42)
        query = {
            "query": {"match_all": {}},
            "size": 1000
        }
        response = self.client.search(index="document", body=query)
        hits = response["hits"]["hits"]
        text_tokenized = self.tokenizer([text])

        with torch.no_grad(), torch.cuda.amp.autocast():
            text_features = self.model.encode_text(text_tokenized)
            text_features /= text_features.norm(dim=-1, keepdim=True)

        images = []

        for hit in hits:
            encoded_embedding = hit['_source']["clip_embedding"]
            decoded_bytes = base64.b64decode(encoded_embedding)
            decoded_image_features_np = np.frombuffer(decoded_bytes, dtype=np.float32)
            image_features_decoded = torch.tensor(decoded_image_features_np.reshape(decoded_image_features_np.shape))

            if self.calculate_distance(text_features, image_features_decoded) > 0.2:
                loaded_image = hit["_source"]["elastic_file_path"]
                if loaded_image:
                    images.append(loaded_image)
        return images

    @staticmethod
    def calculate_distance(text_features, image_features):
        with torch.no_grad(), torch.cuda.amp.autocast():
            image_features /= image_features.norm(dim=-1, keepdim=True)
            text_features /= text_features.norm(dim=-1, keepdim=True)
        return torch.cosine_similarity(image_features, text_features, dim=-1).item()
