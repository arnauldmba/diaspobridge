import { Injectable } from '@angular/core';
import { TRANSPORTER_TRIPS } from '../mocks/transporterTrip.mock';
import { TransporterTrip } from '../model/transporterTrip.model';

@Injectable({
  providedIn: 'root',
})
export class ListingService {

  listing: TransporterTrip[]; 

  constructor() { 
    this.listing = TRANSPORTER_TRIPS;
  }

  getAllListings(): TransporterTrip[] {
    return this.listing;
  }

  addListing(newListing: TransporterTrip): void {
    this.listing.push(newListing);
  }

  deleteListing(listingId: number): void {
    this.listing = this.listing.filter(
      trip => trip.id !== listingId
    );
  }

  consultListing(listingId: number): TransporterTrip {
    return this.listing.find(
      trip => trip.id === listingId
    )!;
  }

  updateListing(updatedListing: TransporterTrip): void {
    const index = this.listing.findIndex(
      trip => trip.id === updatedListing.id
    );
    if (index !== -1) {
      this.listing[index] = updatedListing;
    }
  }

}
