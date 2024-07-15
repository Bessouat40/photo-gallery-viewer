from dotenv import load_dotenv
import os

load_dotenv()

class Config:
    ELASTIC_PORT = os.getenv("ELASTIC_PORT")
    ELASTIC_HOST = os.getenv("ELASTIC_HOST")
    DATA_FOLDER = os.getenv("DATA_FOLDER", "/data/elastic")
