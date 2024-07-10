import { NavBar } from './components/navbar';
import { CanvaPage } from './pages/canva-page';
import { Upload } from './components/upload';
import { UploadPage } from './pages/upload-page';

export class App {
  init(): void {
    this.initApp();
    window.addEventListener('popstate', () => this.route());
  }

  private initApp(): void {
    const navItems = [
      { icon: '/assets/home.png', label: 'Home', url: '/home' },
      { icon: '/assets/upload.png', label: 'Upload', url: '/upload' },
      { icon: '/assets/settings.png', label: 'Settings', url: '/settings' },
    ];
    const navBar = new NavBar(navItems, 'main-nav');
    document.getElementById('main-nav')!.appendChild(navBar.navBar);

    // Attach event listeners to nav links
    navBar.navBar.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', (event) => {
        event.preventDefault();
        const url = (event.currentTarget as HTMLAnchorElement).getAttribute(
          'href'
        );
        history.pushState(null, '', url);
        this.route();
      });
    });

    this.route();
  }

  private async route(): Promise<void> {
    const path = window.location.pathname;
    const content = document.getElementById('content')!;

    content.innerHTML = '';

    if (path === '/home') {
      const canvaPage = new CanvaPage();
      await canvaPage.initPage();
      content.appendChild(canvaPage.page);
    } else if (path === '/upload') {
      const upload = new UploadPage();
      content.appendChild(upload.page);
    } else if (path === '/settings') {
      content.innerHTML = '<h1>Settings Page</h1>';
    } else {
      content.innerHTML = '<h1>Home Page</h1>';
    }
  }
}
