import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms?: string[];
  prompt(): Promise<void>;
  userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class PwaInstallService {
  private initialized = false;

  private deferredPrompt: BeforeInstallPromptEvent | null = null;
  private installBannerTimer: number | null = null;
  private dismissRecheckTimer: number | null = null;
  private iosHelpTimer: number | null = null;

  private readonly DISMISS_KEY = 'mbokogo_install_dismissed_at';
  private readonly IOS_DISMISS_KEY = 'mbokogo_ios_install_dismissed_at';

  // TEST
  //private readonly DISMISS_DURATION_MS = 30 * 1000;
  //private readonly INSTALL_BANNER_DELAY_MS = 2_000;

  // PROD
  private readonly DISMISS_DURATION_MS = 3 * 24 * 60 * 60 * 1000;
  private readonly INSTALL_BANNER_DELAY_MS = 5_000;

  private readonly installedSubject = new BehaviorSubject<boolean>(this.isRunningStandalone());
  readonly installed$ = this.installedSubject.asObservable();

  // Home banner Android / Chrome / Edge
  private readonly canInstallSubject = new BehaviorSubject<boolean>(false);
  readonly canInstall$ = this.canInstallSubject.asObservable();

  // Home banner iPhone
  private readonly showIosHelpSubject = new BehaviorSubject<boolean>(false);
  readonly showIosHelp$ = this.showIosHelpSubject.asObservable();

  // Profil : visible même après "Plus tard"
  private readonly canShowProfileInstallSubject = new BehaviorSubject<boolean>(false);
  readonly canShowProfileInstall$ = this.canShowProfileInstallSubject.asObservable();

  private readonly showProfileIosHelpSubject = new BehaviorSubject<boolean>(false);
  readonly showProfileIosHelp$ = this.showProfileIosHelpSubject.asObservable();

  init(): void {
    if (this.initialized) {
      return;
    }
    this.initialized = true;

    const installed = this.isRunningStandalone();
    const iosDismissedRecently = this.wasDismissedRecently(this.IOS_DISMISS_KEY);

    this.installedSubject.next(installed);
    this.canInstallSubject.next(false);
    this.showIosHelpSubject.next(false);

    if (this.shouldShowIosInstallHelp() && !iosDismissedRecently) {
      this.scheduleIosHelpBanner();
    }

    this.updateProfileInstallState();
    this.scheduleDismissRecheck();

    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();

      if (this.isInstalled()) {
        return;
      }

      this.deferredPrompt = event as BeforeInstallPromptEvent;

      this.updateProfileInstallState();

      if (!this.wasDismissedRecently(this.DISMISS_KEY)) {
        this.scheduleInstallBanner();
      } else {
        this.scheduleDismissRecheck();
      }
    });

    window.addEventListener('appinstalled', () => {
      this.deferredPrompt = null;

      this.clearInstallBannerTimer();
      this.clearDismissRecheckTimer();
      this.clearIosHelpTimer();

      localStorage.removeItem(this.DISMISS_KEY);
      localStorage.removeItem(this.IOS_DISMISS_KEY);

      this.canInstallSubject.next(false);
      this.showIosHelpSubject.next(false);
      this.installedSubject.next(true);

      this.updateProfileInstallState();
    });

    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleDisplayModeChange = (event: MediaQueryListEvent) => {
      const nowInstalled = event.matches || this.isIosStandalone();

      this.installedSubject.next(nowInstalled);

      if (nowInstalled) {
        this.deferredPrompt = null;
        this.clearInstallBannerTimer();
        this.clearDismissRecheckTimer();
        this.clearIosHelpTimer();

        this.canInstallSubject.next(false);
        this.showIosHelpSubject.next(false);
      } else {
        const iosDismissedNow = this.wasDismissedRecently(this.IOS_DISMISS_KEY);

        this.showIosHelpSubject.next(false);
        this.clearIosHelpTimer();

        if (this.shouldShowIosInstallHelp() && !iosDismissedNow) {
          this.scheduleIosHelpBanner();
        }

        if (!!this.deferredPrompt && !this.wasDismissedRecently(this.DISMISS_KEY)) {
          this.scheduleInstallBanner();
        } else {
          this.scheduleDismissRecheck();
        }
      }

      this.updateProfileInstallState();
    };

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleDisplayModeChange);
    }
  }

  isInstalled(): boolean {
    return this.installedSubject.value;
  }

  hasNativeInstallPrompt(): boolean {
    return !!this.deferredPrompt;
  }

  canInstall(): boolean {
    return this.canInstallSubject.value && !this.isInstalled() && !!this.deferredPrompt;
  }

  isIos(): boolean {
    return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
  }

  isSafari(): boolean {
    const ua = window.navigator.userAgent.toLowerCase();
    const isSafariBrowser = ua.includes('safari');
    const isOtherIosBrowser =
      ua.includes('crios') ||
      ua.includes('fxios') ||
      ua.includes('edgios') ||
      ua.includes('opr');

    return isSafariBrowser && !isOtherIosBrowser;
  }

  shouldShowIosInstallHelp(): boolean {
    return this.isIos() && this.isSafari() && !this.isInstalled();
  }

  dismissBanner(): void {
    localStorage.setItem(this.DISMISS_KEY, Date.now().toString());
    this.clearInstallBannerTimer();
    this.canInstallSubject.next(false);
    this.scheduleDismissRecheck();
  }

  dismissIosHelp(): void {
    localStorage.setItem(this.IOS_DISMISS_KEY, Date.now().toString());
    this.clearIosHelpTimer();
    this.showIosHelpSubject.next(false);
  }

  async promptInstall(): Promise<boolean> {
    if (!this.deferredPrompt || this.isInstalled()) {
      return false;
    }

    this.clearInstallBannerTimer();
    this.clearDismissRecheckTimer();

    await this.deferredPrompt.prompt();
    const choice = await this.deferredPrompt.userChoice;

    this.deferredPrompt = null;

    if (choice.outcome === 'accepted') {
      this.canInstallSubject.next(false);
      this.updateProfileInstallState();
      return true;
    }

    localStorage.setItem(this.DISMISS_KEY, Date.now().toString());
    this.canInstallSubject.next(false);
    this.updateProfileInstallState();
    this.scheduleDismissRecheck();

    return false;
  }

  private scheduleInstallBanner(): void {
    this.clearInstallBannerTimer();

    this.installBannerTimer = window.setTimeout(() => {
      if (
        !this.isInstalled() &&
        !!this.deferredPrompt &&
        !this.wasDismissedRecently(this.DISMISS_KEY)
      ) {
        this.canInstallSubject.next(true);
      }
    }, this.INSTALL_BANNER_DELAY_MS);
  }

  private clearInstallBannerTimer(): void {
    if (this.installBannerTimer !== null) {
      window.clearTimeout(this.installBannerTimer);
      this.installBannerTimer = null;
    }
  }

  private scheduleIosHelpBanner(): void {
    this.clearIosHelpTimer();

    this.iosHelpTimer = window.setTimeout(() => {
      if (
        !this.isInstalled() &&
        this.shouldShowIosInstallHelp() &&
        !this.wasDismissedRecently(this.IOS_DISMISS_KEY)
      ) {
        this.showIosHelpSubject.next(true);
      }
    }, this.INSTALL_BANNER_DELAY_MS);
  }

  private clearIosHelpTimer(): void {
    if (this.iosHelpTimer !== null) {
      window.clearTimeout(this.iosHelpTimer);
      this.iosHelpTimer = null;
    }
  }

  private scheduleDismissRecheck(): void {
    this.clearDismissRecheckTimer();

    const dismissedAt = localStorage.getItem(this.DISMISS_KEY);
    if (!dismissedAt) {
      return;
    }

    const dismissedAtMs = Number(dismissedAt);
    if (Number.isNaN(dismissedAtMs)) {
      localStorage.removeItem(this.DISMISS_KEY);
      return;
    }

    const remaining = this.DISMISS_DURATION_MS - (Date.now() - dismissedAtMs);

    if (remaining <= 0) {
      if (!this.isInstalled() && !!this.deferredPrompt) {
        this.scheduleInstallBanner();
      }
      return;
    }

    this.dismissRecheckTimer = window.setTimeout(() => {
      if (!this.isInstalled() && !!this.deferredPrompt) {
        this.scheduleInstallBanner();
      }
    }, remaining);
  }

  private clearDismissRecheckTimer(): void {
    if (this.dismissRecheckTimer !== null) {
      window.clearTimeout(this.dismissRecheckTimer);
      this.dismissRecheckTimer = null;
    }
  }

  private wasDismissedRecently(storageKey: string): boolean {
    const dismissedAt = localStorage.getItem(storageKey);

    if (!dismissedAt) {
      return false;
    }

    const dismissedAtMs = Number(dismissedAt);

    if (Number.isNaN(dismissedAtMs)) {
      localStorage.removeItem(storageKey);
      return false;
    }

    return Date.now() - dismissedAtMs < this.DISMISS_DURATION_MS;
  }

  private updateProfileInstallState(): void {
    const installed = this.isInstalled();

    this.canShowProfileInstallSubject.next(!installed && !!this.deferredPrompt);
    this.showProfileIosHelpSubject.next(!installed && this.shouldShowIosInstallHelp());
  }

  private isRunningStandalone(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches || this.isIosStandalone();
  }

  private isIosStandalone(): boolean {
    return 'standalone' in window.navigator &&
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
  }
}