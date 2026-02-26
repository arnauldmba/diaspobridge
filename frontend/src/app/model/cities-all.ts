import { BaseCity } from './cities-base';
import { CITIES_DE } from './cities-de';
import { CITIES_CM } from './cities-cm';

export const ALL_CITIES: BaseCity[] = [
  ...CITIES_DE,
  ...CITIES_CM,
];