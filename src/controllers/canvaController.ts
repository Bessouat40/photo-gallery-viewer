import { CanvaModel } from '../models/CanvaModel';
import { CanvaView } from '../views/CanvaView';
import { SearchBar } from '../components/searchbar';
import {
  formatCanvaElements,
  getData,
  getFilteredData,
} from '../utils/network';

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
    this.searchBar.setCallback(
      (userQuery: string) => {
        this.handleSearchQuery(userQuery);
      },
      async () => {
        const [columns, rows, resp] = await getData();
        const elements: HTMLElement[] = formatCanvaElements(
          resp,
          columns,
          rows
        );
        this.setElements(elements);
      }
    );
  }

  private async handleSearchQuery(userQuery: string): Promise<void> {
    const elements = await getFilteredData(userQuery);
    this.model.setElements(elements);
  }

  addElement(element: HTMLElement): void {
    this.model.addElement(element);
  }

  setElements(elements: HTMLElement[]): void {
    this.model.setElements(elements);
  }
}
