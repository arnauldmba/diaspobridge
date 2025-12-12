import { Injectable } from '@angular/core';
import { TransporterTrip } from '../model/transporterTrip.model';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CountrySearchCriteria } from '../model/country-search-criteria.model';
import { Page } from '../model/page.model';
import { AuthService } from './auth.service';

// data coming from the backend is of type json
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
  providedIn: 'root',
})

export class ListingService {
  apiUrl = environment.apiUrl;

  listing!: TransporterTrip[]; 

  constructor(private http: HttpClient, private authService: AuthService) {}

  getAllListings(): Observable<TransporterTrip[]> {
    return this.http.get<TransporterTrip[]>(this.apiUrl);
  }

  addListing(newListing: TransporterTrip): Observable<TransporterTrip> {
    return this.http.post<TransporterTrip>(this.apiUrl, newListing);
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

  searchTripsByCountry(criteria: CountrySearchCriteria): Observable<Page<TransporterTrip>> {
    let params = new HttpParams();

    if (criteria.origin) {
      params = params.set('origin', criteria.origin);
    }
    if (criteria.dest) {
      params = params.set('dest', criteria.dest);
    }

    // valeurs par défaut si non fournies
    const page = criteria.page ?? 0;
    const size = criteria.size ?? 10;
    const activeOnly = criteria.activeOnly ?? true;

    params = params
      .set('page', page.toString())
      .set('size', size.toString())
      .set('activeOnly', activeOnly.toString());

    return this.http.get<Page<TransporterTrip>>(
      `${this.apiUrl}/search/country`,
      { params }
    );
  }

  getMyTrips(): Observable<TransporterTrip[]> {
    return this.http.get<TransporterTrip[]>(`${this.apiUrl}/my`);
  }

}
