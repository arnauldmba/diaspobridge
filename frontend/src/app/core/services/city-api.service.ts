import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { CityOption } from '../../shared/models/city-option.model';

@Injectable({
  providedIn: 'root'
})
export class CityApiService {
  private http = inject(HttpClient);

  private readonly citiesUrl = 'assets/data/cities.json';
  
  // GeoDB via RapidAPI
  private readonly apiUrl = 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities';
  //private readonly apiUrl = 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=pa&countryIds=FR,DE,BE';

  // Remplace par ta vraie clé
  private readonly apiKey = '23929bd3b0msh0e46326691e5b91p1cc142jsn8d53d01d831d';
  private readonly apiHost = 'wft-geo-db.p.rapidapi.com';

  searchCities(query: string, countryIds?: string[]): Observable<CityOption[]> {
    if (!query || query.trim().length < 2) {
      return new Observable<CityOption[]>(observer => {
        observer.next([]);
        observer.complete();
      });
    }

    let params = new HttpParams()
      .set('namePrefix', query.trim())
      .set('limit', 10)
      .set('sort', '-population');

    // Exemple: ['DE', 'CM', 'FR']
    if (countryIds && countryIds.length > 0) {
      params = params.set('countryIds', countryIds.join(','));
    }

    const headers = new HttpHeaders({
      'X-RapidAPI-Key': this.apiKey,
      'X-RapidAPI-Host': this.apiHost
    });

    return this.http.get<any>(this.apiUrl, { headers, params }).pipe(
      map(response => {
        const data = response?.data ?? [];

        return data.map((item: any): CityOption => ({
          id: item.id?.toString() ?? '',
          city: item.city ?? '',
          country: item.country ?? '',
          countryCode: item.countryCode ?? '',
          latitude: item.latitude ?? 0,
          longitude: item.longitude ?? 0,
          region: item.region ?? '',
          displayName: `${item.city}, ${item.country}`
        }));
      })
    );
  }
}