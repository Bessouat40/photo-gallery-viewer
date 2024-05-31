import { Canva } from './components/canva';
import { Image } from './components/image';

export class App {
  init(): void {
    this.initApp();
  }

  private initApp(): void {
    const src = '/assets/chien.jpeg';
    const columns: number = 4;
    const rows: number = 4;
    const elements = [];
    const canva = new Canva([columns, rows], 'test-canva');
    canva.addStyle('canva');
    document.body.appendChild(canva.getCanva());
    for (let col = 0; col < 3; col++) {
      for (let row = 0; row < 3; row++) {
        const image = new Image(src, `${col}-${row}`);
        elements.push(image.image);
      }
    }
    canva.populateCanva(elements);
  }
}
