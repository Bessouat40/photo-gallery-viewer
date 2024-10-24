export class Upload {
  upload!: HTMLElement;
  files: File[] = [];
  infos!: HTMLParagraphElement;
  length: number = 0;

  constructor() {
    this.initUpload();
  }

  private initUpload(): void {
    const upload = document.createElement('div');
    upload.classList.add('upload-element');

    const label = document.createElement('label');
    label.htmlFor = 'images';

    const span = document.createElement('span');
    span.textContent = 'Select images';

    const input = document.createElement('input');
    input.type = 'file';
    input.id = 'images';
    input.multiple = true;

    label.appendChild(span);
    label.appendChild(input);
    input.type = 'file';
    input.accept = 'image/*';
    input.addEventListener('change', this.handleFilesSelect.bind(this));

    // upload.appendChild(input);
    upload.appendChild(label);

    this.infos = document.createElement('p');
    this.infos.innerHTML = `Selected files: ${this.length}`;
    upload.appendChild(this.infos);

    this.upload = upload;
    this.upload.appendChild(this.infos);
  }

  private handleFilesSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const filesArray = Array.from(input.files);
    this.length = filesArray.length;
    this.infos.innerHTML = `Selected files: ${this.length}`;
    this.files = filesArray;
  }

  public getFiles(): File[] {
    return this.files;
  }
}
