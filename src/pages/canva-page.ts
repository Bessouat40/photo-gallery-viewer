import { CanvaController } from '../controllers/CanvaController';
import { CanvaModel } from '../models/CanvaModel';
import { CanvaView } from '../views/CanvaView';
import { formatCanvaElements, getData } from '../utils/network';
import { SearchBar } from '../components/searchbar';

export class CanvaPage {
  page!: HTMLElement;

  constructor() {}

  public async initPage(): Promise<void> {
    const searchPageDiv = document.createElement('div');
    searchPageDiv.classList.add('search-page');

    const searchBar = new SearchBar('main-search');
    searchPageDiv.appendChild(searchBar.searchBarContainer);

    const resp: string[] = await getData();

    const name = 'test-canva';

    const canvaModel = new CanvaModel();
    const canvaView = new CanvaView();
    const canvaController = new CanvaController(
      canvaModel,
      canvaView,
      searchBar,
      name
    );

    canvaView.addStyle('canva');

    const elements: HTMLElement[] = formatCanvaElements(resp);
    canvaController.setElements(elements);

    searchPageDiv.appendChild(canvaView.getCanva());

    this.page = searchPageDiv;
  }
}
