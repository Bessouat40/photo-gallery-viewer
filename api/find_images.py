import torch
import open_clip
from elasticsearch import Elasticsearch
import numpy as np

client = Elasticsearch("http://localhost:9200")

model, _, preprocess = open_clip.create_model_and_transforms('ViT-L-14')
tokenizer = open_clip.get_tokenizer('ViT-B-32')

def encode_text(text):
    text_tokens = tokenizer([text])
    with torch.no_grad():
        text_features = model.encode_text(text_tokens)
        text_features /= text_features.norm(dim=-1, keepdim=True)
    return text_features

def search_similar_images(query_text, top_k=5):
    query_features = encode_text(query_text).cpu().numpy().flatten().tolist()

    response = client.search(index="document", body={
        "query": {
            "script_score": {
                "query": {"match_all": {}},
                "script": {
                    "source": "cosineSimilarity(params.query_vector, doc['image_features']) + 1.0",
                    "params": {"query_vector": query_features}
                }
            }
        },
        "size": top_k
    })

    return [(hit["_source"]["image_path"], hit["_score"]) for hit in response["hits"]["hits"]]

if __name__ == "__main__":
    query_text = "a cat"
    similar_images = search_similar_images(query_text)

    print("Similar images:", similar_images)
