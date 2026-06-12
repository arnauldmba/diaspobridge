import { AfterViewInit, Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { PwaUpdateService } from './core/services/pwa-update.service';
import { UnreadMessagesService } from './core/services/unread-messages.service';
import { AuthService } from './core/services/auth.service';
import { PwaInstallService } from './core/services/pwa-install.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements AfterViewInit{

  protected readonly title = signal('MbokoGO');

  canInstall$: Observable<boolean>;

  private readonly pwaUpdateService = inject(PwaUpdateService);
  private readonly unreadMessagesService = inject(UnreadMessagesService);
  private readonly authService = inject(AuthService);

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private translate: TranslateService, 
    private pwaInstallService: PwaInstallService) {
    this.pwaUpdateService.init();
    this.canInstall$ = this.pwaInstallService.canInstall$;

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

  ngOnInit(): void {
    this.pwaInstallService.init();

    this.updateSeo();

    this.translate.onLangChange.subscribe(() => {
      this.updateSeo();
    });
  }

  private updateSeo(): void {
    this.translate.get('SEO.TITLE').subscribe(title => {
      this.titleService.setTitle(title);
    });

    this.translate.get('SEO.DESCRIPTION').subscribe(description => {
      this.metaService.updateTag({
        name: 'description',
        content: description
      });
    });
  }
}
