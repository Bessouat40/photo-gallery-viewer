import { NavBar } from './components/navbar';
import { CanvaPage } from './pages/canva-page';
import { UploadPage } from './pages/upload-page';

export class App {
  init(): void {
    this.initApp();
    window.addEventListener('popstate', () => this.route());
  }

  private initApp(): void {
    const navItems = [
      { icon: '/assets/home.png', label: 'Home', url: '/' },
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

    // Attach event listener to theme toggle button
    const themeToggleBtn = document.getElementById('theme-toggle');
    themeToggleBtn?.addEventListener('click', () => this.toggleTheme());

    // Check for saved theme preference
    this.loadTheme();

    this.route();
  }

  private toggleTheme(): void {
    document.body.classList.toggle('light-theme');
    // Save theme preference
    const isLight = document.body.classList.contains('light-theme');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');

    // Update button icon
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
      themeToggleBtn.innerHTML = isLight ? '🌜' : '🌞';
    }
  }

  private loadTheme(): void {
    const savedTheme = localStorage.getItem('theme');
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (savedTheme === 'light') {
      document.body.classList.add('light-theme');
      if (themeToggleBtn) {
        themeToggleBtn.innerHTML = '🌜';
      }
    } else {
      if (themeToggleBtn) {
        themeToggleBtn.innerHTML = '🌞';
      }
    }
  }

  private async route(): Promise<void> {
    const path = window.location.pathname;
    const content = document.getElementById('content')!;

    content.innerHTML = '';

    if (path === '/') {
      const canvaPage = new CanvaPage();
      await canvaPage.initPage();
      content.appendChild(canvaPage.page);
    } else if (path === '/upload') {
      const upload = new UploadPage();
      content.appendChild(upload.page);
    } else if (path === '/settings') {
      content.innerHTML = '<h1>Settings Page</h1>';
    } else {
      content.innerHTML = '<h1>Unknown page</h1>';
    }
  }
}
