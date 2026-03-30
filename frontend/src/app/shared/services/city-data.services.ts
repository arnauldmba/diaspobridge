import { Injectable } from '@angular/core';
import { ALL_CITIES } from '../data/cities-all';
import { CITIES_CM } from '../data/cities-cm';
import { CITIES_DE } from '../data/cities-de';
import { BaseCity } from '../models/cities-model';

@Injectable({
  providedIn: 'root'
})
export class CityDataService {

  getAllCities(): BaseCity[] {
    return ALL_CITIES;
  }

  getGermanCities(): BaseCity[] {
    return CITIES_DE;
  }

  getCameroonCities(): BaseCity[] {
    return CITIES_CM;
  }

  getCitiesByCountry(countryCode: string): BaseCity[] {
    return ALL_CITIES.filter(city => city.country === countryCode);
  }
}