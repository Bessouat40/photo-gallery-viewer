export class Canva {
  columns!: number;
  rows!: number;
  canva!: HTMLElement;
  name!: string;

  constructor(size: number[], canva_name: string) {
    if (size.length !== 2) {
      throw new Error(
        'Size must be an array of exactly two numbers: [columns, rows]'
      );
    }
    [this.columns, this.rows] = size;
    this.name = canva_name;
    this.initCanva();
  }

  public getCanva(): HTMLElement {
    return this.canva;
  }

  private initCanva(): void {
    const canva_div = document.createElement('div');
    canva_div.style.display = 'grid';
    canva_div.style.gridTemplateColumns = `repeat(${this.columns}, 1fr)`;
    canva_div.style.gridTemplateRows = `repeat(${this.rows}, 1fr)`;

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.columns; col++) {
        const cell = document.createElement('div');
        cell.id = `${this.name}-${col}-${row}`;
        canva_div.appendChild(cell);
      }
    }
    this.canva = canva_div;
  }

  public modifyCell(col: number, row: number, content: HTMLElement): void {
    const cell = document.getElementById(`${this.name}-${col}-${row}`);
    if (cell !== undefined && cell) {
      cell.appendChild(content);
    } else {
      console.error(`Cell at (${col}, ${row}) does not exist...`);
    }
  }

  public populateCanva(elements: HTMLElement[]): void {
    if (elements.length > this.columns * this.rows) {
      console.warn(
        `Canva is size ${this.columns * this.rows} and you try to insert ${
          elements.length
        } elements !!!`
      );
    }
    const canva_length = this.columns * this.rows;
    for (let idx = 0; idx < Math.min(canva_length, elements.length); idx++) {
      const col = idx % this.columns;
      const row = Math.floor(idx / this.rows);
      this.modifyCell(col, row, elements[idx]);
    }
  }

  public addStyle(className: string): void {
    this.canva.classList.add(className);
  }
}
