from fastapi import FastAPI, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from pydantic import BaseModel
import torch

from elasticsearch import Elasticsearch
import base64
from PIL import Image
import numpy as np
import open_clip
import io

model, _, preprocess = open_clip.create_model_and_transforms('ViT-B-32', pretrained='laion2b_s34b_b79k')
tokenizer = open_clip.get_tokenizer('ViT-B-32')

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryModel(BaseModel):
    user_query: str

client = Elasticsearch("http://localhost:9200")

@app.get('/images')
async def get_images():
    return ["/assets/chien.jpeg" for i in range(10)]

@app.get("/get_all_images")
async def get_images():
    try:
        images = await get_all_images()
        return {"images": images}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.post("/get_filtered_images")
async def get_images(query_model: QueryModel):
    # try:
    query = query_model.user_query
    print("query : ", query)
    images = find_similarity(query)
    return {"images": images}
    # except Exception as e:
    #     raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

async def get_all_images():
    try:
        response = client.search(index="document", body={"query": {"match_all": {}}})
        hits = response["hits"]["hits"]
        
        images = []
        
        for hit in hits:
            image = load_image_from_elastic(hit)
            if image : images.append(image)
        return images
    
    except Exception as e:
        print(f"Error retrieving images from Elasticsearch: {str(e)}")
        return []
    
def load_image_from_elastic(hit) :
    try :
        document_data = hit["_source"]["document_embedding"]
        extension = hit["_source"]["extension"]
        
        document_content = base64.b64decode(document_data)
        document = Image.open(io.BytesIO(document_content))
        img_byte_arr = io.BytesIO()
        document.save(img_byte_arr, format=extension)
        img_byte_arr.seek(0)
        
        image_base64 = base64.b64encode(img_byte_arr.read()).decode('utf-8')
        return {"document_id": hit["_id"], "image_base64": image_base64}
    except :
        return None

def calculate_distance(text_features, image_features) :
    with torch.no_grad(), torch.cuda.amp.autocast():
        image_features /= image_features.norm(dim=-1, keepdim=True)
        text_features /= text_features.norm(dim=-1, keepdim=True)

    return torch.cosine_similarity(image_features, text_features, dim=-1).item()

def find_similarity(text):
    torch.manual_seed(42)
    response = client.search(index="document", body={"query": {"match_all": {}}})
    hits = response["hits"]["hits"]
    text_tokenized = tokenizer([text])

    with torch.no_grad(), torch.cuda.amp.autocast():
        text_features = model.encode_text(text_tokenized)
        text_features /= text_features.norm(dim=-1, keepdim=True)

    images = []

    for hit in hits:
        encoded_embedding = hit['_source']["clip_embedding"]
        decoded_bytes = base64.b64decode(encoded_embedding)
        decoded_image_features_np = np.frombuffer(decoded_bytes, dtype=np.float32)
        image_features_decoded = torch.tensor(decoded_image_features_np.reshape(decoded_image_features_np.shape))

        if calculate_distance(text_features, image_features_decoded) > 0.2 :
            loaded_image = load_image_from_elastic(hit)
            if loaded_image :
                images.append(loaded_image)
    return images