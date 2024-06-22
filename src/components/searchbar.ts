export class SearchBar {
  searchBarContainer!: HTMLElement;
  searchBar!: HTMLInputElement;
  searchButton!: HTMLButtonElement;

  constructor(id: string) {
    this.initSearchBar(id);
  }

  private initSearchBar(id: string): void {
    const container = document.createElement('div');
    container.classList.add('search-bar-container');

    const search = document.createElement('input') as HTMLInputElement;
    search.id = id;
    search.classList.add('search');
    search.type = 'text';
    search.placeholder = 'Search';

    const button = document.createElement('button') as HTMLButtonElement;
    button.classList.add('search-button');
    button.textContent = 'Process';

    container.appendChild(search);
    container.appendChild(button);

    this.searchBarContainer = container;
    this.searchBar = search;
    this.searchButton = button;
  }
}
