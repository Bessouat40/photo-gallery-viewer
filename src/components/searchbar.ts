export class SearchBar {
  searchBarContainer!: HTMLElement;
  searchBar!: HTMLInputElement;
  searchButton!: HTMLButtonElement;
  searchCallback!: (userQuery: string) => void;
  clearCallback!: () => void;

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

    button.onclick = () => {
      const userQuery = search.value;
      if (this.searchCallback) {
        this.searchQuerySimilarity(this.searchCallback, userQuery);
      }
    };

    const clearButton = document.createElement('button') as HTMLButtonElement;
    clearButton.classList.add('search-button');
    clearButton.textContent = 'Clear';

    clearButton.onclick = () => {
      if (this.clearCallback) {
        this.clearCallback();
        search.value = '';
      }
    };

    container.appendChild(search);
    container.appendChild(button);
    container.appendChild(clearButton);

    this.searchBarContainer = container;
    this.searchBar = search;
    this.searchButton = button;
  }

  searchQuerySimilarity(
    callback: (userQuery: string) => void,
    userQuery: string
  ): void {
    callback(userQuery);
  }

  setCallback(
    searchCallback: (userQuery: string) => void,
    clearCallback: () => void
  ): void {
    this.searchCallback = searchCallback;
    this.clearCallback = clearCallback;
  }
}
