export class SearchBar {
  searchBarContainer!: HTMLElement;
  searchBar!: HTMLInputElement;
  searchButton!: HTMLButtonElement;

  constructor(id: string) {
    this.initSearchBar(id);
  }

  private initSearchBar(id: string): void {
    // Créer un conteneur pour la barre de recherche
    const container = document.createElement('div');
    container.classList.add('search-bar-container');

    // Créer l'élément input
    const search = document.createElement('input') as HTMLInputElement;
    search.id = id;
    search.classList.add('search');
    search.type = 'text';
    search.placeholder = 'Search';

    // Créer le bouton de recherche
    const button = document.createElement('button') as HTMLButtonElement;
    button.classList.add('search-button');
    button.textContent = 'Process';

    // Ajouter l'input et le bouton au conteneur
    container.appendChild(search);
    container.appendChild(button);

    // Assigner les éléments aux propriétés de la classe
    this.searchBarContainer = container;
    this.searchBar = search;
    this.searchButton = button;
  }
}
