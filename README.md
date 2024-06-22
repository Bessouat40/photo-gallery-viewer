# File Explorer

This project allows you to visualize your images stored inside an Elastic database.

## Requirements

- You need to change `src/utils/network.ts` with your database informations. You need to change the interface to match your database structure :

```typescript
interface ImageData {
  document_id: string;
  image_base64: string;
} // adapt with your structure
```

- Actually, your image needs to be stored being encoded 64 bits, so you can use it as source to display it :

```typescript
export async function getData(): Promise<[number, number, string[]]> {
  try {
    const columns: number = 4;
    const resp = await sendFetch();
    const response: string[] = resp.map(
      (image) => `data:image/jpeg;base64,${image.image_base64}` // here replace with your elastic structure
    );
    const rows: number = Math.ceil(response.length / columns);
```

- You need to change `api/api.py` to adapt the code with your Elastic configuration :

```python
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
```

## Application

![screen](./assets/screen.png)

## TODO

- [ ] Add CLIP use for image filtering,
- [ ] Add paging,
- [ ] Application conteneurisation,
- [ ] Allow CLIP use when offline
