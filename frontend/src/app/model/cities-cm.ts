// cities-cm.ts

import { BaseCity } from "./cities-base";

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



export const CITIES_CM: BaseCity[] = [

  // ===== Littoral (LI) =====
  { id: 1, name: 'Douala', region: 'LI', aliases: ['Dwala'] },
  { id: 2, name: 'Edéa', region: 'LI', aliases: ['Edea'] },
  { id: 3, name: 'Nkongsamba', region: 'LI' },
  { id: 4, name: 'Loum', region: 'LI' },
  { id: 5, name: 'Manjo', region: 'LI' },

  // ===== Centre (CE) =====
  { id: 6, name: 'Yaoundé', region: 'CE', aliases: ['Yaounde'] },
  { id: 7, name: 'Mbalmayo', region: 'CE' },
  { id: 8, name: 'Obala', region: 'CE' },
  { id: 9, name: 'Akonolinga', region: 'CE' },
  { id: 10, name: 'Ntui', region: 'CE' },

  // ===== Ouest (OU) =====
  { id: 11, name: 'Bafoussam', region: 'OU' },
  { id: 12, name: 'Dschang', region: 'OU' },
  { id: 13, name: 'Mbouda', region: 'OU' },
  { id: 14, name: 'Foumban', region: 'OU' },
  { id: 15, name: 'Bangangté', region: 'OU', aliases: ['Bangangte'] },

  // ===== Sud-Ouest (SW) =====
  { id: 16, name: 'Buea', region: 'SW' },
  { id: 17, name: 'Limbe', region: 'SW' },
  { id: 18, name: 'Kumba', region: 'SW' },
  { id: 19, name: 'Tiko', region: 'SW' },
  { id: 20, name: 'Mamfe', region: 'SW' },

  // ===== Nord-Ouest (NW) =====
  { id: 21, name: 'Bamenda', region: 'NW' },
  { id: 22, name: 'Kumbo', region: 'NW' },
  { id: 23, name: 'Wum', region: 'NW' },
  { id: 24, name: 'Ndop', region: 'NW' },

  // ===== Nord (NO) =====
  { id: 25, name: 'Garoua', region: 'NO' },
  { id: 26, name: 'Guider', region: 'NO' },
  { id: 27, name: 'Pitoa', region: 'NO' },

  // ===== Extrême-Nord (EN) =====
  { id: 28, name: 'Maroua', region: 'EN' },
  { id: 29, name: 'Kousséri', region: 'EN', aliases: ['Kousseri'] },
  { id: 30, name: 'Mora', region: 'EN' },

  // ===== Est (ES) =====
  { id: 31, name: 'Bertoua', region: 'ES' },
  { id: 32, name: 'Batouri', region: 'ES' },
  { id: 33, name: 'Abong-Mbang', region: 'ES', aliases: ['Abong Mbang'] },

  // ===== Sud (SU) =====
  { id: 34, name: 'Ebolowa', region: 'SU' },
  { id: 35, name: 'Kribi', region: 'SU' },
  { id: 36, name: 'Sangmélima', region: 'SU', aliases: ['Sangmelima'] },

  // ===== Adamaoua (AD) =====
  { id: 37, name: 'Ngaoundéré', region: 'AD', aliases: ['Ngaoundere'] },
  { id: 38, name: 'Tibati', region: 'AD' },
  { id: 39, name: 'Meiganga', region: 'AD' },

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