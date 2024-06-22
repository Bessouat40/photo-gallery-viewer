from fastapi import FastAPI, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from pydantic import BaseModel

from elasticsearch import Elasticsearch
import base64
from PIL import Image
import io

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Elasticsearch("http://localhost:9200")

@app.get('/images')
async def get_images():
    print('coucou')
    return ["/assets/chien.jpeg" for i in range(10)]

@app.get("/get_all_images")
async def get_images():
    try:
        images = await get_all_images()
        return {"images": images}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

async def get_all_images():
    try:
        response = client.search(index="document", body={"query": {"match_all": {}}})
        hits = response["hits"]["hits"]
        
        images = []
        
        for hit in hits:
            document_data = hit["_source"]["document_embedding"]
            extension = hit["_source"]["extension"]
            
            document_content = base64.b64decode(document_data)
            
            try:
                document = Image.open(io.BytesIO(document_content))
                img_byte_arr = io.BytesIO()
                document.save(img_byte_arr, format=extension)
                img_byte_arr.seek(0)
                
                image_base64 = base64.b64encode(img_byte_arr.read()).decode('utf-8')
                
                images.append({
                    "document_id": hit["_id"],
                    "image_base64": image_base64
                })
            
            except Exception as e:
                print(f"Error processing document with ID {hit['_id']}: {str(e)}")
        
        return images
    
    except Exception as e:
        print(f"Error retrieving images from Elasticsearch: {str(e)}")
        return []