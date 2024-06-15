import { Canva } from './components/canva';
import { Image } from './components/image';
import { NavBar } from './components/navbar';
import { SearchBar } from './components/searchbar';

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
    // const searchBar = new SearchBar('main-search');
    // document.body.appendChild(searchBar.searchBarContainer);
    // const src = '/assets/chien.jpeg';
    // const src2 = '/assets/test.webp';
    // const columns: number = 4;
    // const rows: number = 4;
    // const elements = [];
    // const canva = new Canva([columns, rows], 'test-canva');
    // canva.addStyle('canva');
    // document.body.appendChild(canva.getCanva());
    // for (let col = 0; col < 3; col++) {
    //   for (let row = 0; row < 3; row++) {
    //     const image = new Image(src, `${col}-${row}`, 250, 200);
    //     elements.push(image.image);
    //   }
    // }

    // for (let col = 0; col < 3; col++) {
    //   for (let row = 0; row < 3; row++) {
    //     const image = new Image(src2, `${col}-${row}`, 250, 200);
    //     elements.push(image.image);
    //   }
    // }
    // canva.populateCanva(elements);
    this.initPage();
  }

  private initPage(): void {
    const containerDiv = document.createElement('div');
    containerDiv.classList.add('search-page');
    document.body.appendChild(containerDiv);
    const searchBar = new SearchBar('main-search');
    containerDiv.appendChild(searchBar.searchBarContainer);
    const src = '/assets/chien.jpeg';
    const src2 = '/assets/test.webp';
    const columns: number = 4;
    const rows: number = 4;
    const elements = [];
    const canva = new Canva([columns, rows], 'test-canva');
    canva.addStyle('canva');
    containerDiv.appendChild(canva.getCanva());
    for (let col = 0; col < 3; col++) {
      for (let row = 0; row < 3; row++) {
        const image = new Image(src, `${col}-${row}`, 250, 200);
        elements.push(image.image);
      }
    }

    for (let col = 0; col < 3; col++) {
      for (let row = 0; row < 3; row++) {
        const image = new Image(src2, `${col}-${row}`, 250, 200);
        elements.push(image.image);
      }
    }
    canva.populateCanva(elements);
  }
}
