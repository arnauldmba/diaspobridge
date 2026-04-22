import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { PwaInstallService } from '../../../core/services/pwa-install.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { InstallAppSheet, InstallAppSheetData } from '../install-app-sheet/install-app-sheet';
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-install-banner',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, TranslatePipe],
  templateUrl: './install-banner.html',
  styleUrl: './install-banner.css',
})
export class InstallBanner {
  @Input() mode: 'home' | 'profile' = 'home';

  canInstall$: Observable<boolean>;
  showIosHelp$: Observable<boolean>;
  canShowProfileInstall$: Observable<boolean>;
  showProfileIosHelp$: Observable<boolean>;

  showIosInstructions = false;

  constructor(private pwaInstallService: PwaInstallService, private bottomSheet: MatBottomSheet) {
    this.canInstall$ = this.pwaInstallService.canInstall$;
    this.showIosHelp$ = this.pwaInstallService.showIosHelp$;
    this.canShowProfileInstall$ = this.pwaInstallService.canShowProfileInstall$;
    this.showProfileIosHelp$ = this.pwaInstallService.showProfileIosHelp$;
  }

    openInstallSheet(): void {
    const data: InstallAppSheetData = {
      source: this.mode
    };

    this.bottomSheet.open(InstallAppSheet, {
      data,
      ariaLabel: 'Installer MbokoGO',
      autoFocus: 'dialog',
      panelClass: 'install-app-sheet-panel'
    });
  }

  closeHomeBanner(event: MouseEvent): void {
    event.stopPropagation();
    this.pwaInstallService.dismissBanner();
  }

  closeHomeIosBanner(event: MouseEvent): void {
    event.stopPropagation();
    this.pwaInstallService.dismissIosHelp();
  }
}
