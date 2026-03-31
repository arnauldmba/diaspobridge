import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

type AppLanguage = 'fr' | 'en';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './language-switcher.html',
  styleUrl: './language-switcher.css'
})
export class LanguageSwitcher {
  private translate = inject(TranslateService);

  currentLang: AppLanguage = 'fr';

  readonly languages: { code: AppLanguage; label: string }[] = [
    { code: 'fr', label: 'FR' },
    { code: 'en', label: 'EN' }
  ];

  constructor() {
    const savedLang = localStorage.getItem('app_lang') as AppLanguage | null;
    const browserLang = this.translate.getBrowserLang();

    const langToUse: AppLanguage =
      savedLang === 'fr' || savedLang === 'en'
        ? savedLang
        : browserLang === 'en'
        ? 'en'
        : 'fr';

    this.currentLang = langToUse;
    this.translate.use(langToUse);
  }

  switchLanguage(lang: AppLanguage): void {
    if (this.currentLang === lang) {
      return;
    }

    this.currentLang = lang;
    this.translate.use(lang);
    localStorage.setItem('app_lang', lang);
  }
}