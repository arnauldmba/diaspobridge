import { Component, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MyListings } from "../my-listings/my-listings";
import { Footer } from "../footer/footer/footer";
import { AuthService } from '../services/auth.service';
import { User } from '../model/users.model';
import { FirstLetterPipe } from "../shared/first-letter-pipe";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

@Component({
  selector: 'app-profil',
  imports: [MatTabsModule, MyListings, Footer, FirstLetterPipe, MatProgressSpinnerModule],
  templateUrl: './profil.html',
  styleUrl: './profil.css',
})

export class Profil implements OnInit{

  currentUser: User | null = null;

  isLoading = false;

  constructor(private authService: AuthService){}


  ngOnInit(): void {
    this.isLoading = true;

    this.authService.loadCurrentUser().subscribe({
      next: (user) => {
        console.log('current User service: ', user);
        this.currentUser = user;
        console.log('current User from component: ', this.currentUser);
        this.isLoading = false;
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
