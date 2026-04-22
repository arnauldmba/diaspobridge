import { Component, Inject } from '@angular/core';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef
} from '@angular/material/bottom-sheet';
import { PwaInstallService } from '../../../core/services/pwa-install.service';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';

export interface InstallAppSheetData {
  source: 'home' | 'profile';
}

@Component({
  selector: 'app-install-app-sheet',
  standalone: true,
  imports: [MatIconModule, CommonModule, MatButtonModule, TranslatePipe],
  templateUrl: './install-app-sheet.html',
  styleUrl: './install-app-sheet.css',
})
export class InstallAppSheet {
  showIosInstructions = false;
  canNativeInstall = false;

  constructor(
    private bottomSheetRef: MatBottomSheetRef<InstallAppSheet>,
    private pwaInstallService: PwaInstallService,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: InstallAppSheetData
  ) {
    this.showIosInstructions = this.pwaInstallService.shouldShowIosInstallHelp();
    this.canNativeInstall = this.pwaInstallService.hasNativeInstallPrompt();
  }

  async install(): Promise<void> {
    const installed = await this.pwaInstallService.promptInstall();

    if (installed) {
      this.bottomSheetRef.dismiss(true);
    }
  }

  close(): void {
    this.bottomSheetRef.dismiss(false);
  }

  acknowledgeIosHelp(): void {
    this.pwaInstallService.dismissIosHelp();
    this.bottomSheetRef.dismiss();
  }
}