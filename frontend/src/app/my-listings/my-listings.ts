import { Component } from '@angular/core';
import { TransporterTrip } from '../model/transporterTrip.model';
import { ListingService } from '../services/listing.service';
import { RouterLink } from "@angular/router";
import { AuthService } from '../services/auth.service';
import { FirstLetterPipe } from "../shared/first-letter-pipe";
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-my-listings',
  imports: [RouterLink, MatButtonModule],
  templateUrl: './my-listings.html',
  styleUrl: './my-listings.css',
})
export class MyListings {

  myListings: TransporterTrip[] = [];
  userId!: number;
  notLoggedIn: boolean = false;
  currentUserEmail?:string;

  constructor(private listingService: ListingService, private authService: AuthService) {
  }

  ngOnInit(): void {
    this.listingService.getMyTrips().subscribe({
      next: (trips) => {
        this.myListings = trips;
      },
      error: err => {
        if (err.status === 401 || err.status === 403) {
          this.notLoggedIn = true;
        }
      }
    })

    this.currentUserEmail = this.authService.logedUser; 

    /*
    this.listingService.getMyTrips().subscribe(trips => {
      this.myListings = trips;
    });
    */
  }


  deleteAnnonce(listing: TransporterTrip): void {
    const confirmDelete = confirm("Êtes-vous sûr de vouloir supprimer cette annonce ?");
    if (!confirmDelete) {
      return;
    }

    this.listingService.deleteListing(listing.id!).subscribe({
      next: () => {

        // 🔥 Mettre à jour la liste en local :
        this.myListings = this.myListings.filter(
          trip => trip.id !== listing.id
        );
      },
      error: (error) => {
        console.error('Error deleting listing:', error);
        alert("Une erreur est survenue lors de la suppression.");
      }
    });
  }

  isPastTrip(departDate: string): boolean {
    const d = new Date(departDate + 'T00:00:00'); // force minuit local
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return d < today;
  }
}
