export interface CreateTripRequest {
  originCity: string;
  originCountry?: 'DE' | 'CM';

  destCity: string;
  destCountry?: 'DE' | 'CM';

  departDate: string;

  maxWeightKg: number;
  pricePerKg: number;

  note: string;
}