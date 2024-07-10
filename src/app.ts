import { NavBar } from './components/navbar';
import { CanvaPage } from './pages/canva-page';

export class App {
  init(): void {
    this.initApp();
  }

  private initApp(): void {
    const navItems = [
      { icon: '/assets/home.png', label: 'Home' },
      { icon: '/assets/upload.png', label: 'Upload' },
      { icon: '/assets/settings.png', label: 'Settings' },
    ];
    const navBar = new NavBar(navItems, 'main-nav');
    document.body.appendChild(navBar.navBar);
    const canvaPage = new CanvaPage();
  }
}
