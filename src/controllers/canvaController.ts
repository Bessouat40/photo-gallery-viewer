import { CanvaModel } from '../models/CanvaModel';
import { CanvaView } from '../views/CanvaView';

export class CanvaController {
  constructor(
    private model: CanvaModel,
    private view: CanvaView,
    columns: number,
    rows: number,
    name: string
  ) {
    this.model.subscribe((elements: HTMLElement[]) => {
      this.view.update(elements);
    });

    this.view.init(columns, rows, name);
    this.view.update(this.model.getElements());
  }

  addElement(element: HTMLElement): void {
    this.model.addElement(element);
  }

  setElements(elements: HTMLElement[]): void {
    this.model.setElements(elements);
  }
}
