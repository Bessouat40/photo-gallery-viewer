import { CanvaController } from '../controllers/CanvaController';
import { CanvaModel } from '../models/CanvaModel';
import { CanvaView } from '../views/CanvaView';
import { formatCanvaElements, getData } from '../utils/network';
import { SearchBar } from '../components/searchbar';

export class CanvaPage {
  page!: HTMLElement;

  constructor() {
    // this.initPage();
  }

  public async initPage(): Promise<void> {
    // create page container
    const containerDiv = document.createElement('div');
    containerDiv.classList.add('search-page');

    // init searchbar
    const searchBar = new SearchBar('main-search');
    containerDiv.appendChild(searchBar.searchBarContainer);

    // init canva
    const [columns, rows, resp] = await getData();

    const name = 'test-canva';

    const canvaModel = new CanvaModel();
    const canvaView = new CanvaView();
    const canvaController = new CanvaController(
      canvaModel,
      canvaView,
      searchBar,
      columns,
      rows,
      name
    );
    canvaView.addStyle('canva');
    const elements: HTMLElement[] = formatCanvaElements(resp, columns, rows);
    canvaController.setElements(elements);
    containerDiv.appendChild(canvaView.getCanva());
    this.page = containerDiv;
  }
}
