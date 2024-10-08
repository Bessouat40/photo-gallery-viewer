import { Image } from '../components/image';

const backendURL = 'http://localhost:8000';

interface ImageData {
  document_id: string;
  image_base64: string;
}

async function sendFetch(): Promise<string[]> {
  const resp = await fetch('http://0.0.0.0:8000/get_all_images', {
    method: 'GET',
  }).then((data) => {
    return data.json();
  });
  return resp.images;
}

async function sendFilteredFetch(user_query: string): Promise<ImageData[]> {
  const resp = await fetch('http://0.0.0.0:8000/get_filtered_images', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_query: user_query }),
  }).then((data) => {
    return data.json();
  });
  return resp.images;
}

export async function storeImages(images: File[]): Promise<number> {
  const formData = new FormData();
  images.forEach((image, index) => {
    formData.append('files', image);
  });

  const resp = await fetch('http://0.0.0.0:8000/store_images', {
    method: 'POST',
    body: formData,
  });

  return resp.status;
}

export async function getData(): Promise<[number, number, string[]]> {
  // try {
  const columns: number = 4;
  const resp = await sendFetch();
  const response: string[] = resp;
  const rows: number = Math.ceil(response.length / columns);

  return [columns, rows, response];
  // } catch {
  //   const dogPath: string = '../data/chien.jpeg';
  //   const searchPath: string = '../assets/search.png';
  //   return [
  //     4,
  //     2,
  //     [
  //       dogPath,
  //       dogPath,
  //       dogPath,
  //       dogPath,
  //       searchPath,
  //       searchPath,
  //       searchPath,
  //       searchPath,
  //     ],
  //   ];
  // }
}

export const formatCanvaElements = (
  input: string[],
  columns: number,
  rows: number
): HTMLElement[] => {
  const elements: HTMLElement[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      let idx: number = col + row * 4;
      if (idx < input.length) {
        const fullImageUrl = `${backendURL}${input[idx]}`;
        const image = new Image(fullImageUrl, `${col}-${row}`, 250, 200);
        elements.push(image.image);
      }
    }
  }
  return elements;
};

export async function getFilteredData(
  userQuery: string
): Promise<HTMLElement[]> {
  const columns: number = 4;
  const resp = await sendFilteredFetch(userQuery);
  const response: string[] = resp.map(
    (image) => `data:image/jpeg;base64,${image.image_base64}`
  );
  const rows: number = Math.ceil(response.length / columns);
  const elements: HTMLElement[] = formatCanvaElements(response, columns, rows);
  return elements;
}
