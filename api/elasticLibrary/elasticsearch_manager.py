from elasticsearch import Elasticsearch
import warnings
import torch
import base64
import numpy as np
import open_clip

class ElasticsearchManager:
    _instance = None

    def __new__(cls, host, port):
        if cls._instance is None:
            cls._instance = super(ElasticsearchManager, cls).__new__(cls)
            cls._instance.client = Elasticsearch(f"http://{host}:{port}")
            cls._instance.model, _, cls._instance.preprocess = open_clip.create_model_and_transforms('ViT-B-32', pretrained='laion2b_s34b_b79k')
            cls._instance.tokenizer = open_clip.get_tokenizer('ViT-B-32')
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

    def find_similarity(self, text):
        query = {
            "query": {"match_all": {}},
            "size": 1000
        }
        response = self.client.search(index="document", body=query)
        hits = response["hits"]["hits"]
        text_tokenized = self.tokenizer([text])

        with torch.no_grad():
            text_features = self.model.encode_text(text_tokenized)
            text_features /= text_features.norm(dim=-1, keepdim=True)

        images = []

        for hit in hits:
            image_features_list = hit['_source']["clip_embedding"]
            
            image_features_decoded = torch.tensor(image_features_list)
            image_features_decoded /= image_features_decoded.norm(dim=-1, keepdim=True)

            similarity = torch.nn.functional.cosine_similarity(text_features, image_features_decoded.unsqueeze(0))

            if similarity.item() > 0.2:
                loaded_image = hit["_source"]["elastic_file_path"]
                if loaded_image:
                    images.append(loaded_image)
        
        return images
