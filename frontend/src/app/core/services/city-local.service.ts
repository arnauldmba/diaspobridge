import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, shareReplay } from 'rxjs';
import { CityOption } from '../../shared/models/city-option.model';

@Injectable({
  providedIn: 'root'
})
export class CityLocalService {
  private http = inject(HttpClient);

  private readonly citiesUrl = 'assets/data/cities.json';

  private cities$ = this.http.get<CityOption[]>(this.citiesUrl).pipe(
    map(cities =>
      cities.map(city => ({
        ...city,
        displayName: `${city.city}, ${city.country}`
      }))
    ),
    shareReplay(1)
  );

  getAllCities(): Observable<CityOption[]> {
    return this.cities$;
  }

  searchCities(query: string): Observable<CityOption[]> {
    return this.cities$.pipe(
      map(cities => {
        const q = this.normalize(query);

        if (q.length < 2) {
          return [];
        }

        return cities
          .filter(city =>
            this.normalize(city.city).includes(q) ||
            this.normalize(city.country).includes(q)
          )
          .slice(0, 10);
      })
    );
  }

  private normalize(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }
}