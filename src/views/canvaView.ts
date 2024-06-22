export class CanvaView {
  private canva!: HTMLElement;
  private rows!: number;
  private columns!: number;

  constructor() {}

  public init(columns: number, rows: number, name: string): void {
    this.canva = document.createElement('div');
    this.canva.style.display = 'grid';
    this.canva.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
    this.canva.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    this.columns = columns;
    this.rows = rows;

    for (let row = 0; row < rows; row++) {
      this.addRow(row);
    }
  }

  public addRow(row: number): void {
    for (let col = 0; col < this.columns; col++) {
      const cell = document.createElement('div');
      cell.id = `${name}-${col}-${row}`;
      this.canva.appendChild(cell);
    }
  }

  public getCanva(): HTMLElement {
    return this.canva;
  }

  public modifyCell(col: number, row: number, content: HTMLElement): void {
    const cell = document.getElementById(`${this.canva.id}-${col}-${row}`);
    if (cell !== undefined && cell) {
      cell.appendChild(content);
    } else {
      console.error(`Cell at (${col}, ${row}) does not exist...`);
    }
  }

  public populateCanva(elements: HTMLElement[]): void {
    const cells = this.canva.children;
    for (let idx = 0; idx < elements.length; idx++) {
      if (idx === cells.length) {
        this.addRow(this.rows + 1);
        this.rows++;
        const cells = this.canva.children;
      }
      cells[idx].appendChild(elements[idx]);
    }
  }

  public addStyle(className: string): void {
    this.canva.classList.add(className);
  }

  public update(elements: HTMLElement[]): void {
    this.populateCanva(elements);
  }
}
