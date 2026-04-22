import { Component, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { finalize } from 'rxjs';
import { RouterLink } from '@angular/router';
import { FirstLetterPipe } from '../../../../shared/first-letter-pipe';
import { User } from '../../../../model/users.model';
import { AuthService } from '../../../../core/services/auth.service';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageSwitcher } from "../../../../shared/components/language-switcher/language-switcher";
import { InstallBanner } from "../../../../shared/components/install-banner/install-banner";

@Component({
  selector: 'app-profil',
  imports: [MatTabsModule, FirstLetterPipe, MatProgressSpinnerModule, RouterLink, TranslatePipe, LanguageSwitcher, InstallBanner],
  templateUrl: './profil.html',
  styleUrl: './profil.css',
})

export class Profil implements OnInit{

  currentUser: User | null = null;

  isLoading = false;

  constructor(private authService: AuthService){}


  ngOnInit(): void {
    this.isLoading = true;

    this.authService.loadCurrentUser().pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: (user) => {
        this.currentUser = user;
      },
      error: (err) => {
        console.error('Erreur lors du chargement du user', err);
      }
    });
  }

  logout(){
    this.authService.logout();
  }
}
