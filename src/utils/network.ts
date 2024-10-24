import { Image } from '../components/image';

import * as config from '../config.json';

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

export async function getData(): Promise<string[]> {
  const resp = await sendFetch();
  const response: string[] = resp;
  return response;
}

export const formatCanvaElements = (input: string[]): HTMLElement[] => {
  const elements: HTMLElement[] = input.map((item, idx) => {
    const fullImageUrl = `${backendURL}${item}`;
    const image = new Image(fullImageUrl, `image-${idx}`);
    return image.image;
  });
  return elements;
};

export async function getFilteredData(
  userQuery: string
): Promise<HTMLElement[]> {
  const columns: number = 4;
  const resp = await sendFilteredFetch(userQuery);
  const rows: number = Math.ceil(resp.length / columns);
  const elements: HTMLElement[] = formatCanvaElements(resp);
  return elements;
}
