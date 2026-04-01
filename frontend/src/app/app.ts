import { AfterViewInit, Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from "./layouts/navbar/navbar";
import { TranslateService } from '@ngx-translate/core';
import { PwaUpdateService } from './core/services/pwa-update.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ RouterOutlet, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, AfterViewInit{

  protected readonly title = signal('diasporabridge');

  private readonly pwaUpdateService = inject(PwaUpdateService);

  constructor(private translate: TranslateService) {
    this.translate.setFallbackLang('fr');

    const savedLang = localStorage.getItem('lang') || 'fr';
    this.translate.use(savedLang);
  }

  ngOnInit(): void {
    this.pwaUpdateService.init();
  }

  ngAfterViewInit(): void {
      const splash = document.getElementById('app-splash');

      if (splash) {
        splash.classList.add('hidden');

        setTimeout(() => {
          splash.remove();
        }, 300);
      }
  }
}
