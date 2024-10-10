import { Image } from '../components/image';

import * as config from '../../config.json';

const backendURL = config.backendURL;

async function sendFetch(): Promise<string[]> {
  const resp = await fetch(`${backendURL}/get_all_images`, {
    method: 'GET',
  }).then((data) => {
    return data.json();
  });
  return resp.images;
}

async function sendFilteredFetch(user_query: string): Promise<string[]> {
  const resp = await fetch(`${backendURL}/get_filtered_images`, {
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

  const resp = await fetch(`${backendURL}/store_images`, {
    method: 'POST',
    body: formData,
  });

  return resp.status;
}

export async function getData(): Promise<[number, number, string[]]> {
  const columns: number = 4;
  const resp = await sendFetch();
  const response: string[] = resp;
  const rows: number = Math.ceil(response.length / columns);

  return [columns, rows, response];
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
  const rows: number = Math.ceil(resp.length / columns);
  const elements: HTMLElement[] = formatCanvaElements(resp, columns, rows);
  return elements;
}
