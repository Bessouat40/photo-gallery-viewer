export interface ICanvaModel {
  subscribe(callback: (elements: HTMLElement[]) => void): void;
  addElement(element: HTMLElement): void;
  setElements(elements: HTMLElement[]): void;
  getElements(): HTMLElement[];
}

export class CanvaModel implements ICanvaModel {
  private elements: HTMLElement[] = [];
  private subscribers: ((elements: HTMLElement[]) => void)[] = [];

  constructor() {}

  getElements(): HTMLElement[] {
    return this.elements;
  }

  addElement(element: HTMLElement): void {
    this.elements.push(element);
    this.notifySubscribers();
  }

  setElements(elements: HTMLElement[]): void {
    this.elements = elements;
    this.notifySubscribers();
  }

  subscribe(callback: (elements: HTMLElement[]) => void): void {
    this.subscribers.push(callback);
  }

  private notifySubscribers(): void {
    this.subscribers.forEach((callback) => callback(this.elements));
  }
}
