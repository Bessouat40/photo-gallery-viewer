import base64
from PIL import Image
import io
import os

class ImageProcessor:
    @staticmethod
    def read_document(file_path):
        with open(file_path, "rb") as f:
            document_content = f.read()
            document_base64 = base64.b64encode(document_content).decode("utf-8")
            return document_base64

    @staticmethod
    def get_data_list(path):
        data_list = os.listdir(path)
        document_list = [os.path.join(path, data) for data in data_list]
        return document_list

    @staticmethod
    def load_image_from_elastic(hit):
        try:
            # Récupérer les données de l'image et l'extension
            document_data = hit["_source"]["document_embedding"]
            extension = hit["_source"]["extension"]
            if extension.upper() == 'JPG' : 
                extension = 'jpeg'
            
            # Décoder les données de l'image
            document_content = base64.b64decode(document_data)
            
            # Charger l'image directement depuis le contenu décodé
            with Image.open(io.BytesIO(document_content)) as document:
                # Convertir l'image en base64
                img_byte_arr = io.BytesIO()
                document.save(img_byte_arr, format=extension)
                img_byte_arr.seek(0)
                image_base64 = base64.b64encode(img_byte_arr.read()).decode('utf-8')
            
            return {"document_id": hit["_id"], "image_base64": image_base64}    
        
        except Exception as e:
            print(f"Error loading image from Elasticsearch: {e}")
            return None
