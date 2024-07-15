import { Upload } from '../components/upload';
import { storeImages } from '../utils/network';

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

    button.onclick = async () => {
      const files = upload.getFiles();
      console.log('files : ', files);
      if (files.length > 0) {
        const status = await storeImages(files);
        console.log(`Response status: ${status}`);
      } else {
        console.log('No files selected.');
      }
    };

    container.appendChild(button);

    this.page = container;
  }
}
