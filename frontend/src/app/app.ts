import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from "./layouts/navbar/navbar";
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ RouterOutlet, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App{
  protected readonly title = signal('diasporabridge');

  constructor(private translate: TranslateService) {
    this.translate.setFallbackLang('fr');

    const savedLang = localStorage.getItem('lang') || 'fr';
    this.translate.use(savedLang);
  }
}
