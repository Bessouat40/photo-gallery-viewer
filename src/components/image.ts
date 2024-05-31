export class Image {
  image!: HTMLElement;

  constructor(
    src: string,
    id: string,
    width: number = 150,
    height: number = 150
  ) {
    this.initImage(src, id, width, height);
  }

  private initImage(
    src: string,
    id: string,
    width: number,
    height: number
  ): void {
    const container = document.createElement('div');
    const image = document.createElement('img');
    image.src = src;
    image.id = id;
    image.width = width;
    image.height = height;
    container.appendChild(image);
    this.image = container;
  }
}
