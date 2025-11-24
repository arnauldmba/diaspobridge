import { Injectable } from '@angular/core';
import { TRANSPORTER_TRIPS } from '../mocks/transporterTrip.mock';
import { TransporterTrip } from '../model/transporterTrip.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// data coming from the backend is of type json
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})

export class ListingService {
  apiUrl: string = 'http://localhost:8080/diasporabridge/api/trip';

  listing!: TransporterTrip[]; 

  constructor(private http: HttpClient) { 
    //this.listing = TRANSPORTER_TRIPS;
  }

  getAllListings(): Observable<TransporterTrip[]> {
    return this.http.get<TransporterTrip[]>(this.apiUrl);
  }

  getAllListingsFromApi(): Observable<TransporterTrip[]> {
    return this.http.get<TransporterTrip[]>(this.apiUrl);
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
