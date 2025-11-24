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

  constructor(private http: HttpClient) {}

  getAllListings(): Observable<TransporterTrip[]> {
    return this.http.get<TransporterTrip[]>(this.apiUrl);
  }

  addListing(newListing: TransporterTrip): Observable<TransporterTrip> {
    return this.http.post<TransporterTrip>(this.apiUrl, newListing, httpOptions);
  }

  deleteListing(listingId: number): Observable<void> {
    const url = `${this.apiUrl}/${listingId}`;
    return this.http.delete<void>(url, httpOptions);
  }

  consultListing(listingId: number): Observable<TransporterTrip> {
    const url = `${this.apiUrl}/${listingId}`;
    return this.http.get<TransporterTrip>(url);
  }

  uptateListing(updatedListing: TransporterTrip): Observable<TransporterTrip> {
    const url = `${this.apiUrl}/${updatedListing.id}`;
    return this.http.put<TransporterTrip>(url, updatedListing, httpOptions);
  }

}
