import { CanvaModel } from './models/CanvaModel';
import { CanvaView } from './views/CanvaView';
import { CanvaController } from './controllers/CanvaController';
import { NavBar } from './components/navbar';
import { SearchBar } from './components/searchbar';
import { getData, formatCanvaElements } from './utils/network';

export class App {
  init(): void {
    this.initApp();
  }

  private initApp(): void {
    const navItems = [
      { icon: '/assets/home.png', label: 'Home' },
      { icon: '/assets/search.png', label: 'Search' },
      { icon: '/assets/settings.png', label: 'Settings' },
    ];
    const navBar = new NavBar(navItems, 'main-nav');
    document.body.appendChild(navBar.navBar);
    this.initPage();
  }

  private async initPage(): Promise<void> {
    // create page container
    const containerDiv = document.createElement('div');
    containerDiv.classList.add('search-page');
    document.body.appendChild(containerDiv);

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
      columns,
      rows,
      name
    );
    canvaView.addStyle('canva');
    const elements: HTMLElement[] = formatCanvaElements(resp, columns, rows);
    canvaController.setElements(elements);
    containerDiv.appendChild(canvaView.getCanva());
  }
}
