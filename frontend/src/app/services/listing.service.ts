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
  apiUrl = environment.apiUrl + '/trip';

  listing!: TransporterTrip[];

  constructor(private http: HttpClient, private authService: AuthService) { }

  getAllListings(): Observable<TransporterTrip[]> {
    return this.http.get<TransporterTrip[]>(this.apiUrl);
  }

  getListingById(listingId: number): Observable<TransporterTrip> {
    return this.http.get<TransporterTrip>(`${this.apiUrl}/${listingId}`);
  }

  addListing(newListing: TransporterTrip): Observable<TransporterTrip> {
    return this.http.post<TransporterTrip>(this.apiUrl, newListing);
  }

  deleteListing(listingId: number): Observable<void> {
    const url = `${this.apiUrl}/${listingId}`;
    return this.http.delete<void>(url, httpOptions);
  }

  consultListing(listingId: number): Observable<TransporterTrip> {
    return this.http.get<TransporterTrip>(`${this.apiUrl}/${listingId}`);
  }

  uptateListing(updatedListing: TransporterTrip): Observable<TransporterTrip> {
    return this.http.put<TransporterTrip>(
      `${this.apiUrl}/${updatedListing.id}`,
      updatedListing,
      httpOptions
    );
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

  searchTrips(criteria: CountrySearchCriteria): Observable<Page<TransporterTrip>> {
    let params = new HttpParams();

    if (criteria.origin) params = params.set('origin', criteria.origin); // si on veut chercher par ville d'arrivee on utilise 'dest' et pas 'origin'
    if (criteria.dest) params = params.set('dest', criteria.dest); // si on veut chercher par ville d'arrivee on utilise 'dest' et pas 'origin'
    if (criteria.fromDate) params = params.set('fromDate', criteria.fromDate);
    if (criteria.toDate) params = params.set('toDate', criteria.toDate);

    params = params
      .set('page', String(criteria.page ?? 0))
      .set('size', String(criteria.size ?? 10))
      .set('activeOnly', String(criteria.activeOnly ?? true));

    return this.http.get<Page<TransporterTrip>>(
      `${this.apiUrl}/search`,{ params });
  }

  getMyTrips(): Observable<TransporterTrip[]> {
    return this.http.get<TransporterTrip[]>(`${this.apiUrl}/my`);
  }

}
