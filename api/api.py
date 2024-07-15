import warnings
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import List
from pydantic import BaseModel
import tempfile

from elasticsearch import Elasticsearch

from elasticLibrary.elasticsearch_manager import ElasticsearchManager
from elasticLibrary.image_processor import ImageProcessor
from elasticLibrary.config import Config
from elasticLibrary.embeddings import CLIPEmbeddingStrategy, DummyEmbeddingStrategy

import os

TEMP_UPLOAD_FOLDER = tempfile.mkdtemp()

es_manager = ElasticsearchManager(Config.ELASTIC_HOST, Config.ELASTIC_PORT)
image_processor = ImageProcessor()
clip_strategy = CLIPEmbeddingStrategy()
dummy_strategy = DummyEmbeddingStrategy()

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

@app.post('/store_images')
async def store_images(files: List[UploadFile] = File(...)):
    temp_file_paths = []
    try:
        last_id = es_manager.get_last_document_id()
        for idx, file in enumerate(files):
            temp_file_path = os.path.join(TEMP_UPLOAD_FOLDER, file.filename)
            temp_file_paths.append(temp_file_path)

            with open(temp_file_path, "wb") as temp_file:
                temp_file.write(await file.read())
            dummy_embedding = dummy_strategy.calculate_embedding(temp_file_path)
            clip_embedding = clip_strategy.calculate_embedding(temp_file_path)
            es_manager.index_document(idx + last_id, dummy_embedding, clip_embedding, temp_file_path.split('.')[-1])
            os.remove(temp_file_path)
        return JSONResponse(content={"message": "Files successfully uploaded and indexed."}, status_code=200)
 
    except Exception as e:
        for temp_file_path in temp_file_paths:
            if os.path.exists(temp_file_path):
                os.remove(temp_file_path)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/get_all_images")
async def get_images():
    try:
        query = {
            "query": {"match_all": {}},
            "size": 1000
        }
        hits = es_manager.search_documents(query)['hits']['hits']
        images = []
        for hit in hits : 
            images.append(image_processor.load_image_from_elastic(hit))
        print('images : ', len(images))
        return {"images": images}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
@app.post("/get_filtered_images")
async def get_images(query_model: QueryModel):
    # try:
    query = query_model.user_query
    images = es_manager.find_similarity(query)
    return {"images": images}
    # except Exception as e:
    #     raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")