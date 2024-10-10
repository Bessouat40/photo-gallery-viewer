import warnings
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from typing import List
from pydantic import BaseModel
import tempfile
import uuid

from elasticsearch import Elasticsearch

from elasticLibrary.elasticsearch_manager import ElasticsearchManager
from elasticLibrary.config import Config
from elasticLibrary.embeddings import CLIPEmbeddingStrategy

import os

TEMP_UPLOAD_FOLDER = tempfile.mkdtemp()
es_manager = ElasticsearchManager(Config.ELASTIC_HOST, Config.ELASTIC_PORT)
clip_strategy = CLIPEmbeddingStrategy()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/images", StaticFiles(directory=Config.DATA_FOLDER), name="images")

class QueryModel(BaseModel):
    user_query: str

@app.post('/store_images')
async def store_images(files: List[UploadFile] = File(...)):
    image_ids = []
    try:
        last_id = es_manager.get_last_document_id()
        for idx, file in enumerate(files):
            image_id = str(uuid.uuid4())
            file_extension = file.filename.split('.')[-1]
            permanent_file_path = os.path.join(Config.DATA_FOLDER, f"{image_id}.{file_extension}")
            elastic_file_path = os.path.join("/images/", f"{image_id}.{file_extension}")
            
            with open(permanent_file_path, "wb") as permanent_file:
                permanent_file.write(await file.read())
            
            clip_embedding = clip_strategy.calculate_embedding(permanent_file_path)
            es_manager.index_document(idx + last_id, elastic_file_path, clip_embedding, permanent_file_path.split('.')[-1])
            
            image_ids.append(image_id)

        return JSONResponse(content={"message": "Files successfully uploaded and indexed."}, status_code=200)


    except Exception as e:
        for image_id in image_ids:
            permanent_file_path = os.path.join(PERMANENT_UPLOAD_FOLDER, f"{image_id}.{file_extension}")
            if os.path.exists(permanent_file_path):
                os.remove(permanent_file_path)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/get_all_images")
async def get_images():
    imagesDirs = [f"/images/{file}" for file in os.listdir(Config.DATA_FOLDER) if file.endswith(('jpg', 'jpeg', 'png'))]
    return {"images": imagesDirs}

@app.post("/get_filtered_images")
async def get_images(query_model: QueryModel):
    try:
        query = query_model.user_query
        images = es_manager.find_similarity(query)
        return {"images": images}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")