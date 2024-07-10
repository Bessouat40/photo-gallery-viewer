import { Upload } from '../components/upload';

export class UploadPage {
  page!: HTMLElement;

  constructor() {
    this.initPage();
  }

  private initPage(): void {
    const container = document.createElement('div');
    const upload = new Upload();
    container.appendChild(upload.upload);

    const button = document.createElement('button') as HTMLButtonElement;
    button.classList.add('search-button');
    button.textContent = 'Send into database';

    button.onclick = () => {
      console.log(upload.files);
    };

    container.appendChild(button);

    this.page = container;
  }
}
