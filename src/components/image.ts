export class Image {
  image!: HTMLElement;

  constructor(src: string, id: string) {
    this.initImage(src, id);
    this.addClickListener();
  }

  private initImage(src: string, id: string): void {
    const container = document.createElement('div');
    const image = document.createElement('img');
    image.src = src;
    image.id = id;
    image.style.width = '100%';
    image.style.height = 'auto';
    container.appendChild(image);
    this.image = container;
  }

  private addClickListener(): void {
    this.image.addEventListener('click', () => this.showModal());
  }

  private showModal(): void {
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close-button">&times;</span>
        <img src="${
          (this.image.firstChild as HTMLImageElement).src
        }" style="width:100%">
      </div>
    `;

    document.body.appendChild(modal);

    const closeButton = modal.querySelector('.close-button');
    closeButton?.addEventListener('click', () => {
      modal.remove();
    });

    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        modal.remove();
      }
    });
  }
}
