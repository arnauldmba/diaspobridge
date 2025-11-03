import { Component } from '@angular/core';
import { TransporterTrip } from '../model/transporterTrip.model';
import { TRANSPORTER_TRIPS } from '../mocks/transporterTrip.mock';

@Component({
  selector: 'app-my-listings',
  imports: [],
  templateUrl: './my-listings.html',
  styleUrl: './my-listings.css',
})
export class MyListings {

  myListings: TransporterTrip[] = [];
  userId: number = 1; // Example user ID

  constructor() { }

  ngOnInit(): void {
    this.getAllTransporterTrips();
  }

  getAllTransporterTrips(): TransporterTrip[] {
    this.myListings = TRANSPORTER_TRIPS.filter(
      trip => trip.transporter.id === this.userId
    );
    console.log(this.myListings);
    return this.myListings;
  }
}
