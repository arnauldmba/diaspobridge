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

  myListings?: TransporterTrip[];
  //userId: number = 13; // Example userID
  userId!: number;

  constructor(private listingService: ListingService, private authService: AuthService) {
   }

  ngOnInit(): void {
    this.getAllTransporterTrips();
    this.userId = this.authService.logedUserId!;
  }

  getAllTransporterTrips(): TransporterTrip[] {
    this.listingService.getAllListings().subscribe(data => {
      this.myListings = data.filter(
        trip => trip.transporter.id === this.userId
      );
      console.log(this.myListings);
    });
    return this.myListings!;
  }
  

  deleteAnnonce(listing: TransporterTrip): void {
    let confirmDelete = confirm("Êtes-vous sûr de vouloir supprimer cette annonce ?");
    if (!confirmDelete) {
      return;
    }

    this.listingService.deleteListing(listing.id!).subscribe(() => {
      console.log('Listing deleted successfully');
      this.getAllTransporterTrips();
    }, error => {
      console.error('Error deleting listing:', error);
    });
  }
}
