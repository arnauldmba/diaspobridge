import { Component } from '@angular/core';
import { TransporterTrip } from '../model/transporterTrip.model';
import { TRANSPORTER_TRIPS } from '../mocks/transporterTrip.mock';
import { ListingService } from '../services/listing.service';
import { RouterLink } from "@angular/router";
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-my-listings',
  imports: [RouterLink],
  templateUrl: './my-listings.html',
  styleUrl: './my-listings.css',
})
export class MyListings {

  myListings: TransporterTrip[] = [];
  userId!: number;

  constructor(private listingService: ListingService, private authService: AuthService) {
   }

  ngOnInit(): void {
    this.listingService.getMyTrips().subscribe(trips => {
      this.myListings = trips;
    });
  }
  

  deleteAnnonce(listing: TransporterTrip): void {
    const confirmDelete = confirm("Êtes-vous sûr de vouloir supprimer cette annonce ?");
    if (!confirmDelete) {
      return;
    }

    this.listingService.deleteListing(listing.id!).subscribe({
      next: () => {
        console.log('Listing deleted successfully');

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
}
