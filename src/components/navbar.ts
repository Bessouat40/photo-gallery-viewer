export class NavBar {
  navBar!: HTMLElement;

  constructor(items: { icon: string; label: string }[], id: string) {
    this.initNavBar(items, id);
  }

  private initNavBar(
    items: { icon: string; label: string }[],
    id: string
  ): void {
    const nav = document.createElement('nav');
    nav.id = id;
    nav.classList.add('vertical-nav');

    const ul = document.createElement('ul');

    items.forEach((item) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = '#';
      const img = document.createElement('img');
      img.src = item.icon;
      img.alt = item.label;
      a.appendChild(img);
      li.appendChild(a);
      ul.appendChild(li);
    });

    nav.appendChild(ul);
    this.navBar = nav;
  }
}
