import torch
import open_clip
import base64
from PIL import Image
import numpy as np

class EmbeddingStrategy:
    def calculate_embedding(self, document_path):
        raise NotImplementedError

class CLIPEmbeddingStrategy(EmbeddingStrategy):
    def __init__(self, model_name='ViT-B-32', pretrained='laion2b_s34b_b79k'):
        self.model, _, self.preprocess = open_clip.create_model_and_transforms(model_name, pretrained=pretrained)
        self.tokenizer = open_clip.get_tokenizer(model_name)
    
    def calculate_embedding(self, document_path):
        try:
            with open(document_path, 'rb') as f:
                image = Image.open(f).convert("RGB")
                image = self.preprocess(image).unsqueeze(0)
            
            with torch.no_grad():
                image_features = self.model.encode_image(image)
            image_features /= image_features.norm(dim=-1, keepdim=True)
            embedding = image_features.squeeze(0).numpy().tolist()
            return embedding
        
        except Exception as e:
            raise ValueError(f"Error processing the image: {e}")
