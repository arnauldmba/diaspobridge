// cities-cm.ts
import { BaseCity } from './cities-base';

export type CameroonRegion =
  | 'AD'  // Adamaoua
  | 'CE'  // Centre
  | 'ES'  // Est
  | 'EN'  // Extrême-Nord
  | 'LI'  // Littoral
  | 'NO'  // Nord
  | 'NW'  // Nord-Ouest
  | 'OU'  // Ouest
  | 'SU'  // Sud
  | 'SW'; // Sud-Ouest

// Petit helper pour générer des IDs propres: CM-001, CM-002, ...
const cmId = (n: number) => `CM-${String(n).padStart(3, '0')}`;

export const CITIES_CM: BaseCity[] = [
  // ===== Littoral (LI) =====
  { id: cmId(1), name: 'Douala', region: 'LI' satisfies CameroonRegion, aliases: ['Dwala'], country: 'CM' },
  { id: cmId(2), name: 'Edéa', region: 'LI' satisfies CameroonRegion, aliases: ['Edea'], country: 'CM' },
  { id: cmId(3), name: 'Nkongsamba', region: 'LI' satisfies CameroonRegion, country: 'CM' },
  { id: cmId(4), name: 'Loum', region: 'LI' satisfies CameroonRegion, country: 'CM' },
  { id: cmId(5), name: 'Manjo', region: 'LI' satisfies CameroonRegion, country: 'CM' },

  // ===== Centre (CE) =====
  { id: cmId(6), name: 'Yaoundé', region: 'CE' satisfies CameroonRegion, aliases: ['Yaounde'], country: 'CM' },
  { id: cmId(7), name: 'Mbalmayo', region: 'CE' satisfies CameroonRegion, country: 'CM' },
  { id: cmId(8), name: 'Obala', region: 'CE' satisfies CameroonRegion, country: 'CM' },
  { id: cmId(9), name: 'Akonolinga', region: 'CE' satisfies CameroonRegion, country: 'CM' },
  { id: cmId(10), name: 'Ntui', region: 'CE' satisfies CameroonRegion, country: 'CM' },

  // ===== Ouest (OU) =====
  { id: cmId(11), name: 'Bafoussam', region: 'OU' satisfies CameroonRegion, country: 'CM' },
  { id: cmId(12), name: 'Dschang', region: 'OU' satisfies CameroonRegion, country: 'CM' },
  { id: cmId(13), name: 'Mbouda', region: 'OU' satisfies CameroonRegion, country: 'CM' },
  { id: cmId(14), name: 'Foumban', region: 'OU' satisfies CameroonRegion, country: 'CM' },
  { id: cmId(15), name: 'Bangangté', region: 'OU' satisfies CameroonRegion, aliases: ['Bangangte'], country: 'CM' },

  // ===== Sud-Ouest (SW) =====
  { id: cmId(16), name: 'Buea', region: 'SW' satisfies CameroonRegion, country: 'CM' },
  { id: cmId(17), name: 'Limbe', region: 'SW' satisfies CameroonRegion, country: 'CM' },
  { id: cmId(18), name: 'Kumba', region: 'SW' satisfies CameroonRegion, country: 'CM' },
  { id: cmId(19), name: 'Tiko', region: 'SW' satisfies CameroonRegion, country: 'CM' },
  { id: cmId(20), name: 'Mamfe', region: 'SW' satisfies CameroonRegion, country: 'CM' },

  // ===== Nord-Ouest (NW) =====
  { id: cmId(21), name: 'Bamenda', region: 'NW' satisfies CameroonRegion, country: 'CM' },
  { id: cmId(22), name: 'Kumbo', region: 'NW' satisfies CameroonRegion, country: 'CM' },
  { id: cmId(23), name: 'Wum', region: 'NW' satisfies CameroonRegion, country: 'CM' },
  { id: cmId(24), name: 'Ndop', region: 'NW' satisfies CameroonRegion, country: 'CM' },

  // ===== Nord (NO) =====
  { id: cmId(25), name: 'Garoua', region: 'NO' satisfies CameroonRegion, country: 'CM' },
  { id: cmId(26), name: 'Guider', region: 'NO' satisfies CameroonRegion, country: 'CM' },
  { id: cmId(27), name: 'Pitoa', region: 'NO' satisfies CameroonRegion, country: 'CM' },

  // ===== Extrême-Nord (EN) =====
  { id: cmId(28), name: 'Maroua', region: 'EN' satisfies CameroonRegion, country: 'CM' },
  { id: cmId(29), name: 'Kousséri', region: 'EN' satisfies CameroonRegion, aliases: ['Kousseri'], country: 'CM' },
  { id: cmId(30), name: 'Mora', region: 'EN' satisfies CameroonRegion, country: 'CM' },

  // ===== Est (ES) =====
  { id: cmId(31), name: 'Bertoua', region: 'ES' satisfies CameroonRegion, country: 'CM' },
  { id: cmId(32), name: 'Batouri', region: 'ES' satisfies CameroonRegion, country: 'CM' },
  { id: cmId(33), name: 'Abong-Mbang', region: 'ES' satisfies CameroonRegion, aliases: ['Abong Mbang'], country: 'CM' },

  // ===== Sud (SU) =====
  { id: cmId(34), name: 'Ebolowa', region: 'SU' satisfies CameroonRegion, country: 'CM' },
  { id: cmId(35), name: 'Kribi', region: 'SU' satisfies CameroonRegion, country: 'CM' },
  { id: cmId(36), name: 'Sangmélima', region: 'SU' satisfies CameroonRegion, aliases: ['Sangmelima'], country: 'CM' },

  // ===== Adamaoua (AD) =====
  { id: cmId(37), name: 'Ngaoundéré', region: 'AD' satisfies CameroonRegion, aliases: ['Ngaoundere'], country: 'CM' },
  { id: cmId(38), name: 'Tibati', region: 'AD' satisfies CameroonRegion, country: 'CM' },
  { id: cmId(39), name: 'Meiganga', region: 'AD' satisfies CameroonRegion, country: 'CM' },
];

export function normalizeCityQuery(value: string): string {
  return (value || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ');
}

export function citySearchKey(city: BaseCity): string {
  const base = [city.name, ...(city.aliases || [])].join(' ');
  return normalizeCityQuery(base);
}