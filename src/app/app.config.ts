import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { tokenInterceptor } from './services/token-interceptor';
import { provideToastr } from 'ngx-toastr';

import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
   // { provide: LOCALE_ID, useValue: 'de-DE' }, // Set the locale to German (Germany) 'fr-FR' for French
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([tokenInterceptor])), 
    provideAnimations(), // required animations providers
    importProvidersFrom(BrowserAnimationsModule),
    provideToastr() // Toastr providers

  ]
};
