from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/images')
async def get_images():
    print('coucou')
    return ["/assets/chien.jpeg" for i in range(10)]
