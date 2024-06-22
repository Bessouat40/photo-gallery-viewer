import { Image } from '../components/image';

export const getData = async () => {
  try {
    const resp = await fetch('http://0.0.0.0:8000/images', {
      method: 'GET',
    }).then((data) => {
      return data.json();
    });

    const columns: number = 4;
    const rows: number = Math.ceil(resp.length / columns);
    return [columns, rows, resp];
  } catch {
    const dogPath: string = '../assets/chien.jpeg';
    const searchPath: string = '../assets/search.png';
    return [
      4,
      2,
      [
        dogPath,
        dogPath,
        dogPath,
        dogPath,
        searchPath,
        searchPath,
        searchPath,
        searchPath,
      ],
    ];
  }
};

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
        const image = new Image(input[idx], `${col}-${row}`, 250, 200);
        elements.push(image.image);
      }
    }
  }
  return elements;
};
