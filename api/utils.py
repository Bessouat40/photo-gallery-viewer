from elasticsearch import Elasticsearch
import base64
import matplotlib.pyplot as plt
from PIL import Image
import io

client = Elasticsearch("http://localhost:9200")

def load_document(document_id):
    response = client.get(index="document", id=document_id)
    if response.get("found", False):
        document_data = response["_source"]["document_embedding"]
        extension = response["_source"]["extension"]
        
        document_content = base64.b64decode(document_data)
        
        document = Image.open(io.BytesIO(document_content))
        
        plt.imshow(document)
        plt.axis('off')
        plt.show()
        
        return document
    else:
        print(f"Document with ID {document_id} not found.")
