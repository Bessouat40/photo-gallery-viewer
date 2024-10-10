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
