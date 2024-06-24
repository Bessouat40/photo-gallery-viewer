import { CanvaModel } from '../models/CanvaModel';
import { CanvaView } from '../views/CanvaView';
import { SearchBar } from '../components/searchbar';
import { getFilteredData } from '../utils/network';

export class CanvaController {
  constructor(
    private model: CanvaModel,
    private view: CanvaView,
    private searchBar: SearchBar,
    columns: number,
    rows: number,
    name: string
  ) {
    this.model.subscribe((elements: HTMLElement[]) => {
      this.view.update(elements);
    });

    this.view.init(columns, rows, name);
    this.view.update(this.model.getElements());
    this.initSearchBar();
  }

  private initSearchBar(): void {
    this.searchBar.setCallback((userQuery: string) => {
      this.handleSearchQuery(userQuery);
    });
  }

  private async handleSearchQuery(userQuery: string): Promise<void> {
    alert(userQuery);
    const elements = await getFilteredData(userQuery);
    this.model.setElements(elements);
    alert(elements);
  }

  addElement(element: HTMLElement): void {
    this.model.addElement(element);
  }

  setElements(elements: HTMLElement[]): void {
    this.model.setElements(elements);
  }
}
