import { BaseCity } from "./cities-base";

export type GermanState =
  | 'BW' | 'BY' | 'BE' | 'BB' | 'HB' | 'HH' | 'HE' | 'MV'
  | 'NI' | 'NW' | 'RP' | 'SL' | 'SN' | 'ST' | 'SH' | 'TH';



export const CITIES_DE: BaseCity[] = [
  // ===== Top grandes villes + hubs (NRW très présent) =====
  { id: 1, name: 'Berlin', state: 'BE' },
  { id: 2, name: 'Hamburg', state: 'HH' },
  { id: 3, name: 'München', state: 'BY', aliases: ['Muenchen', 'Munich'] },
  { id: 4, name: 'Köln', state: 'NW', aliases: ['Koeln', 'Cologne'] },
  { id: 5, name: 'Frankfurt am Main', state: 'HE', aliases: ['Frankfurt'] },
  { id: 6, name: 'Stuttgart', state: 'BW' },
  { id: 7, name: 'Düsseldorf', state: 'NW', aliases: ['Duesseldorf', 'Dusseldorf'] },
  { id: 8, name: 'Leipzig', state: 'SN' },
  { id: 9, name: 'Dortmund', state: 'NW' },
  { id: 10, name: 'Essen', state: 'NW' },
  { id: 11, name: 'Bremen', state: 'HB' },
  { id: 12, name: 'Dresden', state: 'SN' },
  { id: 13, name: 'Hannover', state: 'NI' },
  { id: 14, name: 'Nürnberg', state: 'BY', aliases: ['Nuernberg', 'Nuremberg'] },
  { id: 15, name: 'Duisburg', state: 'NW' },
  { id: 16, name: 'Bochum', state: 'NW' },
  { id: 17, name: 'Wuppertal', state: 'NW' },
  { id: 18, name: 'Bielefeld', state: 'NW' },
  { id: 19, name: 'Bonn', state: 'NW' },
  { id: 20, name: 'Münster', state: 'NW', aliases: ['Muenster'] },
  { id: 21, name: 'Karlsruhe', state: 'BW' },
  { id: 22, name: 'Mannheim', state: 'BW' },
  { id: 23, name: 'Augsburg', state: 'BY' },
  { id: 24, name: 'Wiesbaden', state: 'HE' },
  { id: 25, name: 'Gelsenkirchen', state: 'NW' },
  { id: 26, name: 'Mönchengladbach', state: 'NW', aliases: ['Moenchengladbach'] },
  { id: 27, name: 'Braunschweig', state: 'NI' },
  { id: 28, name: 'Chemnitz', state: 'SN' },
  { id: 29, name: 'Kiel', state: 'SH' },
  { id: 30, name: 'Aachen', state: 'NW' },
  { id: 31, name: 'Halle (Saale)', state: 'ST', aliases: ['Halle'] },
  { id: 32, name: 'Magdeburg', state: 'ST' },
  { id: 33, name: 'Freiburg im Breisgau', state: 'BW', aliases: ['Freiburg'] },
  { id: 34, name: 'Krefeld', state: 'NW' },
  { id: 35, name: 'Lübeck', state: 'SH', aliases: ['Luebeck'] },
  { id: 36, name: 'Oberhausen', state: 'NW' },
  { id: 37, name: 'Erfurt', state: 'TH' },
  { id: 38, name: 'Mainz', state: 'RP' },
  { id: 39, name: 'Rostock', state: 'MV' },
  { id: 40, name: 'Kassel', state: 'HE' },

  // ===== NRW (complément très utile) =====
  { id: 41, name: 'Hagen', state: 'NW' },
  { id: 42, name: 'Hamm', state: 'NW' },
  { id: 43, name: 'Herne', state: 'NW' },
  { id: 44, name: 'Mülheim an der Ruhr', state: 'NW', aliases: ['Muelheim an der Ruhr', 'Muelheim'] },
  { id: 45, name: 'Leverkusen', state: 'NW' },
  { id: 46, name: 'Solingen', state: 'NW' },
  { id: 47, name: 'Remscheid', state: 'NW' },
  { id: 48, name: 'Neuss', state: 'NW' },
  { id: 49, name: 'Paderborn', state: 'NW' },
  { id: 50, name: 'Bottrop', state: 'NW' },
  { id: 51, name: 'Recklinghausen', state: 'NW' },
  { id: 52, name: 'Bergisch Gladbach', state: 'NW' },
  { id: 53, name: 'Siegen', state: 'NW' },
  { id: 54, name: 'Moers', state: 'NW' },
  { id: 55, name: 'Gütersloh', state: 'NW', aliases: ['Guetersloh'] },
  { id: 56, name: 'Iserlohn', state: 'NW' },
  { id: 57, name: 'Düren', state: 'NW', aliases: ['Dueren'] },
  { id: 58, name: 'Bocholt', state: 'NW' },
  { id: 59, name: 'Detmold', state: 'NW' },
  { id: 60, name: 'Hürth', state: 'NW', aliases: ['Huerth'] },
  { id: 61, name: 'Kerpen', state: 'NW' },
  { id: 62, name: 'Troisdorf', state: 'NW' },
  { id: 63, name: 'Ratingen', state: 'NW' },
  { id: 64, name: 'Hilden', state: 'NW' },
  { id: 65, name: 'Velbert', state: 'NW' },
  { id: 66, name: 'Gladbeck', state: 'NW' },
  { id: 67, name: 'Castrop-Rauxel', state: 'NW' },
  { id: 68, name: 'Lüdenscheid', state: 'NW', aliases: ['Luedenscheid'] },
  { id: 69, name: 'Arnsberg', state: 'NW' },
  { id: 70, name: 'Lippstadt', state: 'NW' },
  { id: 71, name: 'Unna', state: 'NW' },
  { id: 72, name: 'Wesel', state: 'NW' },
  { id: 73, name: 'Dinslaken', state: 'NW' },
  { id: 74, name: 'Rheine', state: 'NW' },
  { id: 75, name: 'Ahlen', state: 'NW' },
  { id: 76, name: 'Minden', state: 'NW' },
  { id: 77, name: 'Herford', state: 'NW' },
  { id: 78, name: 'Gummersbach', state: 'NW' },
  { id: 79, name: 'Euskirchen', state: 'NW' },

  // ===== NI (Niedersachsen) =====
  { id: 80, name: 'Oldenburg', state: 'NI' },
  { id: 81, name: 'Osnabrück', state: 'NI', aliases: ['Osnabrueck'] },
  { id: 82, name: 'Wolfsburg', state: 'NI' },
  { id: 83, name: 'Göttingen', state: 'NI', aliases: ['Goettingen'] },
  { id: 84, name: 'Hildesheim', state: 'NI' },
  { id: 85, name: 'Salzgitter', state: 'NI' },
  { id: 86, name: 'Celle', state: 'NI' },
  { id: 87, name: 'Lüneburg', state: 'NI', aliases: ['Lueneburg'] },
  { id: 88, name: 'Delmenhorst', state: 'NI' },
  { id: 89, name: 'Wilhelmshaven', state: 'NI' },
  { id: 90, name: 'Garbsen', state: 'NI' },
  { id: 91, name: 'Hameln', state: 'NI' },
  { id: 92, name: 'Lingen (Ems)', state: 'NI', aliases: ['Lingen'] },
  { id: 93, name: 'Nordhorn', state: 'NI' },
  { id: 94, name: 'Emden', state: 'NI' },
  { id: 95, name: 'Cuxhaven', state: 'NI' },
  { id: 96, name: 'Goslar', state: 'NI' },
  { id: 97, name: 'Peine', state: 'NI' },
  { id: 98, name: 'Wolfenbüttel', state: 'NI', aliases: ['Wolfenbuettel'] },

  // ===== BW (Baden-Württemberg) =====
  { id: 99, name: 'Heidelberg', state: 'BW' },
  { id: 100, name: 'Heilbronn', state: 'BW' },
  { id: 101, name: 'Ulm', state: 'BW' },
  { id: 102, name: 'Pforzheim', state: 'BW' },
  { id: 103, name: 'Reutlingen', state: 'BW' },
  { id: 104, name: 'Esslingen am Neckar', state: 'BW' },
  { id: 105, name: 'Tübingen', state: 'BW', aliases: ['Tuebingen'] },
  { id: 106, name: 'Konstanz', state: 'BW' },
  { id: 107, name: 'Offenburg', state: 'BW' },
  { id: 108, name: 'Ravensburg', state: 'BW' },
  { id: 109, name: 'Sindelfingen', state: 'BW' },
  { id: 110, name: 'Ludwigsburg', state: 'BW' },
  { id: 111, name: 'Waiblingen', state: 'BW' },
  { id: 112, name: 'Villingen-Schwenningen', state: 'BW' },
  { id: 113, name: 'Aalen', state: 'BW' },
  { id: 114, name: 'Göpingen', state: 'BW', aliases: ['Goepingen'] },
  { id: 115, name: 'Schwäbisch Gmünd', state: 'BW', aliases: ['Schwaebisch Gmuend'] },
  { id: 116, name: 'Friedrichshafen', state: 'BW' },
  { id: 117, name: 'Baden-Baden', state: 'BW' },
  { id: 118, name: 'Singen (Hohentwiel)', state: 'BW', aliases: ['Singen'] },
  { id: 119, name: 'Rottweil', state: 'BW' },

  // ===== BY (Bayern) =====
  { id: 120, name: 'Regensburg', state: 'BY' },
  { id: 121, name: 'Würzburg', state: 'BY', aliases: ['Wuerzburg'] },
  { id: 122, name: 'Ingolstadt', state: 'BY' },
  { id: 123, name: 'Fürth', state: 'BY', aliases: ['Fuerth'] },
  { id: 124, name: 'Erlangen', state: 'BY' },
  { id: 125, name: 'Bamberg', state: 'BY' },
  { id: 126, name: 'Bayreuth', state: 'BY' },
  { id: 127, name: 'Aschaffenburg', state: 'BY' },
  { id: 128, name: 'Landshut', state: 'BY' },
  { id: 129, name: 'Passau', state: 'BY' },
  { id: 130, name: 'Rosenheim', state: 'BY' },
  { id: 131, name: 'Kempten (Allgäu)', state: 'BY', aliases: ['Kempten'] },
  { id: 132, name: 'Garmisch-Partenkirchen', state: 'BY' },
  { id: 133, name: 'Schweinfurt', state: 'BY' },
  { id: 134, name: 'Coburg', state: 'BY' },
  { id: 135, name: 'Hof', state: 'BY' },
  { id: 136, name: 'Neu-Ulm', state: 'BY' },
  { id: 137, name: 'Memmingen', state: 'BY' },
  { id: 138, name: 'Straubing', state: 'BY' },
  { id: 139, name: 'Ansbach', state: 'BY' },
  { id: 140, name: 'Amberg', state: 'BY' },
  { id: 141, name: 'Weiden in der Oberpfalz', state: 'BY', aliases: ['Weiden'] },
  { id: 142, name: 'Freising', state: 'BY' },
  { id: 143, name: 'Dachau', state: 'BY' },
  { id: 144, name: 'Fürstenfeldbruck', state: 'BY', aliases: ['Fuerstenfeldbruck'] },

  // ===== HE (Hessen) =====
  { id: 145, name: 'Darmstadt', state: 'HE' },
  { id: 146, name: 'Offenbach am Main', state: 'HE', aliases: ['Offenbach'] },
  { id: 147, name: 'Hanau', state: 'HE' },
  { id: 148, name: 'Gießen', state: 'HE', aliases: ['Giessen'] },
  { id: 149, name: 'Marburg', state: 'HE' },
  { id: 150, name: 'Fulda', state: 'HE' },
  { id: 151, name: 'Rüsselsheim am Main', state: 'HE', aliases: ['Ruesselsheim', 'Rüsselsheim'] },
  { id: 152, name: 'Bad Homburg vor der Höhe', state: 'HE', aliases: ['Bad Homburg'] },
  { id: 153, name: 'Wetzlar', state: 'HE' },
  { id: 154, name: 'Bensheim', state: 'HE' },
  { id: 155, name: 'Langen', state: 'HE' },
  { id: 156, name: 'Neu-Isenburg', state: 'HE', aliases: ['Neu Isenburg'] },
  { id: 157, name: 'Hofheim am Taunus', state: 'HE', aliases: ['Hofheim'] },
  { id: 158, name: 'Bad Nauheim', state: 'HE' },
  { id: 159, name: 'Friedberg (Hessen)', state: 'HE', aliases: ['Friedberg'] },
  { id: 160, name: 'Limburg an der Lahn', state: 'HE', aliases: ['Limburg'] },

  // ===== RP (Rheinland-Pfalz) =====
  { id: 161, name: 'Ludwigshafen am Rhein', state: 'RP', aliases: ['Ludwigshafen'] },
  { id: 162, name: 'Koblenz', state: 'RP' },
  { id: 163, name: 'Trier', state: 'RP' },
  { id: 164, name: 'Kaiserslautern', state: 'RP' },
  { id: 165, name: 'Worms', state: 'RP' },
  { id: 166, name: 'Neustadt an der Weinstraße', state: 'RP', aliases: ['Neustadt an der Weinstrasse', 'Neustadt'] },
  { id: 167, name: 'Speyer', state: 'RP' },
  { id: 168, name: 'Bad Kreuznach', state: 'RP' },
  { id: 169, name: 'Landau in der Pfalz', state: 'RP', aliases: ['Landau'] },
  { id: 170, name: 'Pirmasens', state: 'RP' },
  { id: 171, name: 'Bingen am Rhein', state: 'RP', aliases: ['Bingen'] },
  { id: 172, name: 'Jena', state: 'TH' },       // (remplace une ville moins utile)
  { id: 173, name: 'Weimar', state: 'TH' },     // (remplace une ville moins utile)

  // ===== SH (Schleswig-Holstein) =====
  { id: 174, name: 'Flensburg', state: 'SH' },
  { id: 175, name: 'Neumünster', state: 'SH', aliases: ['Neumuenster'] },
  { id: 176, name: 'Norderstedt', state: 'SH' },
  { id: 177, name: 'Elmshorn', state: 'SH' },
  { id: 178, name: 'Pinneberg', state: 'SH' },
  { id: 179, name: 'Ahrensburg', state: 'SH' },
  { id: 180, name: 'Itzehoe', state: 'SH' },
  { id: 181, name: 'Rendsburg', state: 'SH' },
  { id: 182, name: 'Husum', state: 'SH' },
  { id: 183, name: 'Bad Segeberg', state: 'SH' },

  // ===== HB (Bremen) =====
  { id: 184, name: 'Bremerhaven', state: 'HB' },

  // ===== BB (Brandenburg) =====
  { id: 185, name: 'Potsdam', state: 'BB' },
  { id: 186, name: 'Cottbus', state: 'BB' },
  { id: 187, name: 'Brandenburg an der Havel', state: 'BB', aliases: ['Brandenburg'] },
  { id: 188, name: 'Frankfurt (Oder)', state: 'BB', aliases: ['Frankfurt Oder'] },
  { id: 189, name: 'Oranienburg', state: 'BB' },
  { id: 190, name: 'Falkensee', state: 'BB' },
  { id: 191, name: 'Eberswalde', state: 'BB' },
  { id: 192, name: 'Bernau bei Berlin', state: 'BB', aliases: ['Bernau'] },
  { id: 193, name: 'Fürstenwalde/Spree', state: 'BB', aliases: ['Fuerstenwalde'] },
  { id: 194, name: 'Königs Wusterhausen', state: 'BB', aliases: ['Koenigs Wusterhausen'] },

  // ===== MV (Mecklenburg-Vorpommern) =====
  { id: 195, name: 'Schwerin', state: 'MV' },
  { id: 196, name: 'Neubrandenburg', state: 'MV' },
  { id: 197, name: 'Greifswald', state: 'MV' },
  { id: 198, name: 'Stralsund', state: 'MV' },
  { id: 199, name: 'Wismar', state: 'MV' },

  // ===== SL (Saarland) =====
  { id: 200, name: 'Saarbrücken', state: 'SL', aliases: ['Saarbruecken'] },
];

/**
 * Normalise la saisie : "Köln" == "Koeln" == "koln"
 * (utile pour matcher aliases et éviter les problèmes d'Umlaut)
 */
export function normalizeCityQuery(value: string): string {
  return (value || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')                // sépare accents
    .replace(/[\u0300-\u036f]/g, '') // supprime accents
    .replace(/ß/g, 'ss')
    .replace(/\s+/g, ' ');
}

/**
 * Optionnel : texte indexable (name + aliases) déjà normalisé
 * pour un filtrage très rapide côté frontend.
 */
export function citySearchKey(city: BaseCity): string {
  const base = [city.name, ...(city.aliases || [])].join(' ');
  return normalizeCityQuery(base);
}