export class CanvaView {
  private canva!: HTMLElement;

  constructor() {}

  public init(name: string): void {
    this.canva = document.createElement('div');
    this.canva.classList.add('canva');
    this.canva.id = name;
  }

  public getCanva(): HTMLElement {
    return this.canva;
  }

  public clearCanva(): void {
    while (this.canva.firstChild) {
      this.canva.removeChild(this.canva.firstChild);
    }
  }

  public populateCanva(elements: HTMLElement[]): void {
    this.clearCanva();
    elements.forEach((element) => {
      this.canva.appendChild(element);
    });
  }

  public addStyle(className: string): void {
    this.canva.classList.add(className);
  }

  public update(elements: HTMLElement[]): void {
    this.populateCanva(elements);
  }
}
