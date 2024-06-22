from elasticsearch import Elasticsearch
import base64
import matplotlib.pyplot as plt
from PIL import Image
import io

# Initialisation du client Elasticsearch
client = Elasticsearch("http://localhost:9200")

def load_document(document_id):
    # Récupérer le document correspondant à l'ID du document
    response = client.get(index="document", id=document_id)
    if response.get("found", False):
        # Extraire les données du document et l'extension du fichier
        document_data = response["_source"]["document_embedding"]
        extension = response["_source"]["extension"]
        
        # Décoder les données du document base64
        document_content = base64.b64decode(document_data)
        
        # Créer une image à partir des données binaires
        document = Image.open(io.BytesIO(document_content))
        
        # Afficher le document
        plt.imshow(document)
        plt.axis('off')
        plt.show()
        
        return document
    else:
        print(f"Document with ID {document_id} not found.")

# Charger un document à partir de l'index "document" avec l'ID spécifié
document_id_to_load = 1  # ID du document à charger
loaded_document = load_document(document_id_to_load)
