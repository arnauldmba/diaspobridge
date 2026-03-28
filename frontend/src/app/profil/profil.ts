import { Component, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MyListings } from "../my-listings/my-listings";
import { Footer } from "../footer/footer/footer";
import { AuthService } from '../services/auth.service';
import { User } from '../model/users.model';
import { FirstLetterPipe } from "../shared/first-letter-pipe";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { finalize } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profil',
  imports: [MatTabsModule, MyListings, Footer, FirstLetterPipe, MatProgressSpinnerModule, RouterLink],
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
