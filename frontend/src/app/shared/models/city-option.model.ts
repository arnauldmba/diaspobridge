export interface CityOption {
  id: string;
  city: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  population?: number; // adapte a city-local
  region?: string;
  displayName: string;
}