import { AfterViewInit, Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from "./layouts/navbar/navbar";
import { TranslateService } from '@ngx-translate/core';
import { PwaUpdateService } from './core/services/pwa-update.service';
import { UnreadMessagesService } from './core/services/unread-messages.service';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ RouterOutlet, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements AfterViewInit{

  //protected readonly title = signal('diasporabridge');

  private readonly pwaUpdateService = inject(PwaUpdateService);
  private readonly unreadMessagesService = inject(UnreadMessagesService);
  private readonly authService = inject(AuthService);

  constructor(private translate: TranslateService) {
    this.pwaUpdateService.init();

    if (this.authService.isLoggedIn()) {
      this.unreadMessagesService.startPolling();
    }

    this.translate.setFallbackLang('fr');

    const savedLang = localStorage.getItem('lang');
    const lang = savedLang === 'en' || savedLang === 'fr' ? savedLang : 'fr';
    this.translate.use(lang);
  }

  ngAfterViewInit(): void {
    const splash = document.getElementById('app-splash');

    if (splash) {
      setTimeout(() => {
        splash.classList.add('hidden');

        setTimeout(() => {
          splash.remove();
        }, 300);
      }, 500);
    }
  }
}
