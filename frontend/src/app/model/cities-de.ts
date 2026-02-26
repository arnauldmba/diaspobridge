// cities-de.ts
import { BaseCity } from './cities-base';

export type GermanState =
  | 'BW' | 'BY' | 'BE' | 'BB' | 'HB' | 'HH' | 'HE' | 'MV'
  | 'NI' | 'NW' | 'RP' | 'SL' | 'SN' | 'ST' | 'SH' | 'TH';

// Helper IDs: DE-001, DE-002, ...
const deId = (n: number) => `DE-${String(n).padStart(3, '0')}`;

export const CITIES_DE: BaseCity[] = [
  // ===== Top grandes villes + hubs (NRW très présent) =====
  { id: deId(1), name: 'Berlin', state: 'BE' satisfies GermanState, country: 'DE' },
  { id: deId(2), name: 'Hamburg', state: 'HH' satisfies GermanState, country: 'DE' },
  { id: deId(3), name: 'München', state: 'BY' satisfies GermanState, aliases: ['Muenchen', 'Munich'], country: 'DE' },
  { id: deId(4), name: 'Köln', state: 'NW' satisfies GermanState, aliases: ['Koeln', 'Cologne'], country: 'DE' },
  { id: deId(5), name: 'Frankfurt am Main', state: 'HE' satisfies GermanState, aliases: ['Frankfurt'], country: 'DE' },
  { id: deId(6), name: 'Stuttgart', state: 'BW' satisfies GermanState, country: 'DE' },
  { id: deId(7), name: 'Düsseldorf', state: 'NW' satisfies GermanState, aliases: ['Duesseldorf', 'Dusseldorf'], country: 'DE' },
  { id: deId(8), name: 'Leipzig', state: 'SN' satisfies GermanState, country: 'DE' },
  { id: deId(9), name: 'Dortmund', state: 'NW' satisfies GermanState, country: 'DE' },
  { id: deId(10), name: 'Essen', state: 'NW' satisfies GermanState, country: 'DE' },
  { id: deId(11), name: 'Bremen', state: 'HB' satisfies GermanState, country: 'DE' },
  { id: deId(12), name: 'Dresden', state: 'SN' satisfies GermanState, country: 'DE' },
  { id: deId(13), name: 'Hannover', state: 'NI' satisfies GermanState, country: 'DE' },
  { id: deId(14), name: 'Nürnberg', state: 'BY' satisfies GermanState, aliases: ['Nuernberg', 'Nuremberg'], country: 'DE' },
  { id: deId(15), name: 'Duisburg', state: 'NW' satisfies GermanState, country: 'DE' },
  { id: deId(16), name: 'Bochum', state: 'NW' satisfies GermanState, country: 'DE' },
  { id: deId(17), name: 'Wuppertal', state: 'NW' satisfies GermanState, country: 'DE' },
  { id: deId(18), name: 'Bielefeld', state: 'NW' satisfies GermanState, country: 'DE' },
  { id: deId(19), name: 'Bonn', state: 'NW' satisfies GermanState, country: 'DE' },
  { id: deId(20), name: 'Münster', state: 'NW' satisfies GermanState, aliases: ['Muenster'], country: 'DE' },
  { id: deId(21), name: 'Karlsruhe', state: 'BW' satisfies GermanState, country: 'DE' },
  { id: deId(22), name: 'Mannheim', state: 'BW' satisfies GermanState, country: 'DE' },
  { id: deId(23), name: 'Augsburg', state: 'BY' satisfies GermanState, country: 'DE' },
  { id: deId(24), name: 'Wiesbaden', state: 'HE' satisfies GermanState, country: 'DE' },
  { id: deId(25), name: 'Gelsenkirchen', state: 'NW' satisfies GermanState, country: 'DE' },
  { id: deId(26), name: 'Mönchengladbach', state: 'NW' satisfies GermanState, aliases: ['Moenchengladbach'], country: 'DE' },
  { id: deId(27), name: 'Braunschweig', state: 'NI' satisfies GermanState, country: 'DE' },
  { id: deId(28), name: 'Chemnitz', state: 'SN' satisfies GermanState, country: 'DE' },
  { id: deId(29), name: 'Kiel', state: 'SH' satisfies GermanState, country: 'DE' },
  { id: deId(30), name: 'Aachen', state: 'NW' satisfies GermanState, country: 'DE' },
  { id: deId(31), name: 'Halle (Saale)', state: 'ST' satisfies GermanState, aliases: ['Halle'], country: 'DE' },
  { id: deId(32), name: 'Magdeburg', state: 'ST' satisfies GermanState, country: 'DE' },
  { id: deId(33), name: 'Freiburg im Breisgau', state: 'BW' satisfies GermanState, aliases: ['Freiburg'], country: 'DE' },
  { id: deId(34), name: 'Krefeld', state: 'NW' satisfies GermanState, country: 'DE' },
  { id: deId(35), name: 'Lübeck', state: 'SH' satisfies GermanState, aliases: ['Luebeck'], country: 'DE' },
  { id: deId(36), name: 'Oberhausen', state: 'NW' satisfies GermanState, country: 'DE' },
  { id: deId(37), name: 'Erfurt', state: 'TH' satisfies GermanState, country: 'DE' },
  { id: deId(38), name: 'Mainz', state: 'RP' satisfies GermanState, country: 'DE' },
  { id: deId(39), name: 'Rostock', state: 'MV' satisfies GermanState, country: 'DE' },
  { id: deId(40), name: 'Kassel', state: 'HE' satisfies GermanState, country: 'DE' },

  // ===== NRW (complément très utile) =====
  { id: deId(41), name: 'Hagen', state: 'NW' satisfies GermanState, country: 'DE' },
  { id: deId(42), name: 'Hamm', state: 'NW' satisfies GermanState, country: 'DE' },
  { id: deId(43), name: 'Herne', state: 'NW' satisfies GermanState, country: 'DE' },
  { id: deId(44), name: 'Mülheim an der Ruhr', state: 'NW' satisfies GermanState, aliases: ['Muelheim an der Ruhr', 'Muelheim'], country: 'DE' },
  { id: deId(45), name: 'Leverkusen', state: 'NW' satisfies GermanState, country: 'DE' },
  { id: deId(46), name: 'Solingen', state: 'NW' satisfies GermanState, country: 'DE' },
  { id: deId(47), name: 'Remscheid', state: 'NW' satisfies GermanState, country: 'DE' },
  { id: deId(48), name: 'Neuss', state: 'NW' satisfies GermanState, country: 'DE' },
  { id: deId(49), name: 'Paderborn', state: 'NW' satisfies GermanState, country: 'DE' },
  { id: deId(50), name: 'Bottrop', state: 'NW' satisfies GermanState, country: 'DE' },
  { id: deId(51), name: 'Recklinghausen', state: 'NW' satisfies GermanState, country: 'DE' },
  { id: deId(52), name: 'Bergisch Gladbach', state: 'NW' satisfies GermanState, country: 'DE' },
  { id: deId(53), name: 'Siegen', state: 'NW' satisfies GermanState, country: 'DE' },
  { id: deId(54), name: 'Moers', state: 'NW' satisfies GermanState, country: 'DE' },
  { id: deId(55), name: 'Gütersloh', state: 'NW' satisfies GermanState, aliases: ['Guetersloh'], country: 'DE' },
  { id: deId(56), name: 'Iserlohn', state: 'NW' satisfies GermanState, country: 'DE' },
  { id: deId(57), name: 'Düren', state: 'NW' satisfies GermanState, aliases: ['Dueren'], country: 'DE' },
  { id: deId(58), name: 'Bocholt', state: 'NW' satisfies GermanState, country: 'DE' },
  { id: deId(59), name: 'Detmold', state: 'NW' satisfies GermanState, country: 'DE' },
  { id: deId(60), name: 'Hürth', state: 'NW' satisfies GermanState, aliases: ['Huerth'], country: 'DE' },
  { id: deId(61), name: 'Kerpen', state: 'NW' satisfies GermanState, country: 'DE' },
  { id: deId(62), name: 'Troisdorf', state: 'NW' satisfies GermanState, country: 'DE' },
  { id: deId(63), name: 'Ratingen', state: 'NW' satisfies GermanState, country: 'DE' },
  { id: deId(64), name: 'Hilden', state: 'NW' satisfies GermanState, country: 'DE' },
  { id: deId(65), name: 'Velbert', state: 'NW' satisfies GermanState, country: 'DE' },
  { id: deId(66), name: 'Gladbeck', state: 'NW' satisfies GermanState, country: 'DE' },
  { id: deId(67), name: 'Castrop-Rauxel', state: 'NW' satisfies GermanState, country: 'DE' },
  { id: deId(68), name: 'Lüdenscheid', state: 'NW' satisfies GermanState, aliases: ['Luedenscheid'], country: 'DE' },
  { id: deId(69), name: 'Arnsberg', state: 'NW' satisfies GermanState, country: 'DE' },
  { id: deId(70), name: 'Lippstadt', state: 'NW' satisfies GermanState, country: 'DE' },
  { id: deId(71), name: 'Unna', state: 'NW' satisfies GermanState, country: 'DE' },
  { id: deId(72), name: 'Wesel', state: 'NW' satisfies GermanState, country: 'DE' },
  { id: deId(73), name: 'Dinslaken', state: 'NW' satisfies GermanState, country: 'DE' },
  { id: deId(74), name: 'Rheine', state: 'NW' satisfies GermanState, country: 'DE' },
  { id: deId(75), name: 'Ahlen', state: 'NW' satisfies GermanState, country: 'DE' },
  { id: deId(76), name: 'Minden', state: 'NW' satisfies GermanState, country: 'DE' },
  { id: deId(77), name: 'Herford', state: 'NW' satisfies GermanState, country: 'DE' },
  { id: deId(78), name: 'Gummersbach', state: 'NW' satisfies GermanState, country: 'DE' },
  { id: deId(79), name: 'Euskirchen', state: 'NW' satisfies GermanState, country: 'DE' },

  // ===== NI (Niedersachsen) =====
  { id: deId(80), name: 'Oldenburg', state: 'NI' satisfies GermanState, country: 'DE' },
  { id: deId(81), name: 'Osnabrück', state: 'NI' satisfies GermanState, aliases: ['Osnabrueck'], country: 'DE' },
  { id: deId(82), name: 'Wolfsburg', state: 'NI' satisfies GermanState, country: 'DE' },
  { id: deId(83), name: 'Göttingen', state: 'NI' satisfies GermanState, aliases: ['Goettingen'], country: 'DE' },
  { id: deId(84), name: 'Hildesheim', state: 'NI' satisfies GermanState, country: 'DE' },
  { id: deId(85), name: 'Salzgitter', state: 'NI' satisfies GermanState, country: 'DE' },
  { id: deId(86), name: 'Celle', state: 'NI' satisfies GermanState, country: 'DE' },
  { id: deId(87), name: 'Lüneburg', state: 'NI' satisfies GermanState, aliases: ['Lueneburg'], country: 'DE' },
  { id: deId(88), name: 'Delmenhorst', state: 'NI' satisfies GermanState, country: 'DE' },
  { id: deId(89), name: 'Wilhelmshaven', state: 'NI' satisfies GermanState, country: 'DE' },
  { id: deId(90), name: 'Garbsen', state: 'NI' satisfies GermanState, country: 'DE' },
  { id: deId(91), name: 'Hameln', state: 'NI' satisfies GermanState, country: 'DE' },
  { id: deId(92), name: 'Lingen (Ems)', state: 'NI' satisfies GermanState, aliases: ['Lingen'], country: 'DE' },
  { id: deId(93), name: 'Nordhorn', state: 'NI' satisfies GermanState, country: 'DE' },
  { id: deId(94), name: 'Emden', state: 'NI' satisfies GermanState, country: 'DE' },
  { id: deId(95), name: 'Cuxhaven', state: 'NI' satisfies GermanState, country: 'DE' },
  { id: deId(96), name: 'Goslar', state: 'NI' satisfies GermanState, country: 'DE' },
  { id: deId(97), name: 'Peine', state: 'NI' satisfies GermanState, country: 'DE' },
  { id: deId(98), name: 'Wolfenbüttel', state: 'NI' satisfies GermanState, aliases: ['Wolfenbuettel'], country: 'DE' },

  // ===== BW (Baden-Württemberg) =====
  { id: deId(99), name: 'Heidelberg', state: 'BW' satisfies GermanState, country: 'DE' },
  { id: deId(100), name: 'Heilbronn', state: 'BW' satisfies GermanState, country: 'DE' },
  { id: deId(101), name: 'Ulm', state: 'BW' satisfies GermanState, country: 'DE' },
  { id: deId(102), name: 'Pforzheim', state: 'BW' satisfies GermanState, country: 'DE' },
  { id: deId(103), name: 'Reutlingen', state: 'BW' satisfies GermanState, country: 'DE' },
  { id: deId(104), name: 'Esslingen am Neckar', state: 'BW' satisfies GermanState, country: 'DE' },
  { id: deId(105), name: 'Tübingen', state: 'BW' satisfies GermanState, aliases: ['Tuebingen'], country: 'DE' },
  { id: deId(106), name: 'Konstanz', state: 'BW' satisfies GermanState, country: 'DE' },
  { id: deId(107), name: 'Offenburg', state: 'BW' satisfies GermanState, country: 'DE' },
  { id: deId(108), name: 'Ravensburg', state: 'BW' satisfies GermanState, country: 'DE' },
  { id: deId(109), name: 'Sindelfingen', state: 'BW' satisfies GermanState, country: 'DE' },
  { id: deId(110), name: 'Ludwigsburg', state: 'BW' satisfies GermanState, country: 'DE' },
  { id: deId(111), name: 'Waiblingen', state: 'BW' satisfies GermanState, country: 'DE' },
  { id: deId(112), name: 'Villingen-Schwenningen', state: 'BW' satisfies GermanState, country: 'DE' },
  { id: deId(113), name: 'Aalen', state: 'BW' satisfies GermanState, country: 'DE' },
  { id: deId(114), name: 'Göpingen', state: 'BW' satisfies GermanState, aliases: ['Goepingen'], country: 'DE' },
  { id: deId(115), name: 'Schwäbisch Gmünd', state: 'BW' satisfies GermanState, aliases: ['Schwaebisch Gmuend'], country: 'DE' },
  { id: deId(116), name: 'Friedrichshafen', state: 'BW' satisfies GermanState, country: 'DE' },
  { id: deId(117), name: 'Baden-Baden', state: 'BW' satisfies GermanState, country: 'DE' },
  { id: deId(118), name: 'Singen (Hohentwiel)', state: 'BW' satisfies GermanState, aliases: ['Singen'], country: 'DE' },
  { id: deId(119), name: 'Rottweil', state: 'BW' satisfies GermanState, country: 'DE' },

  // ===== BY (Bayern) =====
  { id: deId(120), name: 'Regensburg', state: 'BY' satisfies GermanState, country: 'DE' },
  { id: deId(121), name: 'Würzburg', state: 'BY' satisfies GermanState, aliases: ['Wuerzburg'], country: 'DE' },
  { id: deId(122), name: 'Ingolstadt', state: 'BY' satisfies GermanState, country: 'DE' },
  { id: deId(123), name: 'Fürth', state: 'BY' satisfies GermanState, aliases: ['Fuerth'], country: 'DE' },
  { id: deId(124), name: 'Erlangen', state: 'BY' satisfies GermanState, country: 'DE' },
  { id: deId(125), name: 'Bamberg', state: 'BY' satisfies GermanState, country: 'DE' },
  { id: deId(126), name: 'Bayreuth', state: 'BY' satisfies GermanState, country: 'DE' },
  { id: deId(127), name: 'Aschaffenburg', state: 'BY' satisfies GermanState, country: 'DE' },
  { id: deId(128), name: 'Landshut', state: 'BY' satisfies GermanState, country: 'DE' },
  { id: deId(129), name: 'Passau', state: 'BY' satisfies GermanState, country: 'DE' },
  { id: deId(130), name: 'Rosenheim', state: 'BY' satisfies GermanState, country: 'DE' },
  { id: deId(131), name: 'Kempten (Allgäu)', state: 'BY' satisfies GermanState, aliases: ['Kempten'], country: 'DE' },
  { id: deId(132), name: 'Garmisch-Partenkirchen', state: 'BY' satisfies GermanState, country: 'DE' },
  { id: deId(133), name: 'Schweinfurt', state: 'BY' satisfies GermanState, country: 'DE' },
  { id: deId(134), name: 'Coburg', state: 'BY' satisfies GermanState, country: 'DE' },
  { id: deId(135), name: 'Hof', state: 'BY' satisfies GermanState, country: 'DE' },
  { id: deId(136), name: 'Neu-Ulm', state: 'BY' satisfies GermanState, country: 'DE' },
  { id: deId(137), name: 'Memmingen', state: 'BY' satisfies GermanState, country: 'DE' },
  { id: deId(138), name: 'Straubing', state: 'BY' satisfies GermanState, country: 'DE' },
  { id: deId(139), name: 'Ansbach', state: 'BY' satisfies GermanState, country: 'DE' },
  { id: deId(140), name: 'Amberg', state: 'BY' satisfies GermanState, country: 'DE' },
  { id: deId(141), name: 'Weiden in der Oberpfalz', state: 'BY' satisfies GermanState, aliases: ['Weiden'], country: 'DE' },
  { id: deId(142), name: 'Freising', state: 'BY' satisfies GermanState, country: 'DE' },
  { id: deId(143), name: 'Dachau', state: 'BY' satisfies GermanState, country: 'DE' },
  { id: deId(144), name: 'Fürstenfeldbruck', state: 'BY' satisfies GermanState, aliases: ['Fuerstenfeldbruck'], country: 'DE' },

  // ===== HE (Hessen) =====
  { id: deId(145), name: 'Darmstadt', state: 'HE' satisfies GermanState, country: 'DE' },
  { id: deId(146), name: 'Offenbach am Main', state: 'HE' satisfies GermanState, aliases: ['Offenbach'], country: 'DE' },
  { id: deId(147), name: 'Hanau', state: 'HE' satisfies GermanState, country: 'DE' },
  { id: deId(148), name: 'Gießen', state: 'HE' satisfies GermanState, aliases: ['Giessen'], country: 'DE' },
  { id: deId(149), name: 'Marburg', state: 'HE' satisfies GermanState, country: 'DE' },
  { id: deId(150), name: 'Fulda', state: 'HE' satisfies GermanState, country: 'DE' },
  { id: deId(151), name: 'Rüsselsheim am Main', state: 'HE' satisfies GermanState, aliases: ['Ruesselsheim', 'Rüsselsheim'], country: 'DE' },
  { id: deId(152), name: 'Bad Homburg vor der Höhe', state: 'HE' satisfies GermanState, aliases: ['Bad Homburg'], country: 'DE' },
  { id: deId(153), name: 'Wetzlar', state: 'HE' satisfies GermanState, country: 'DE' },
  { id: deId(154), name: 'Bensheim', state: 'HE' satisfies GermanState, country: 'DE' },
  { id: deId(155), name: 'Langen', state: 'HE' satisfies GermanState, country: 'DE' },
  { id: deId(156), name: 'Neu-Isenburg', state: 'HE' satisfies GermanState, aliases: ['Neu Isenburg'], country: 'DE' },
  { id: deId(157), name: 'Hofheim am Taunus', state: 'HE' satisfies GermanState, aliases: ['Hofheim'], country: 'DE' },
  { id: deId(158), name: 'Bad Nauheim', state: 'HE' satisfies GermanState, country: 'DE' },
  { id: deId(159), name: 'Friedberg (Hessen)', state: 'HE' satisfies GermanState, aliases: ['Friedberg'], country: 'DE' },
  { id: deId(160), name: 'Limburg an der Lahn', state: 'HE' satisfies GermanState, aliases: ['Limburg'], country: 'DE' },

  // ===== RP (Rheinland-Pfalz) =====
  { id: deId(161), name: 'Ludwigshafen am Rhein', state: 'RP' satisfies GermanState, aliases: ['Ludwigshafen'], country: 'DE' },
  { id: deId(162), name: 'Koblenz', state: 'RP' satisfies GermanState, country: 'DE' },
  { id: deId(163), name: 'Trier', state: 'RP' satisfies GermanState, country: 'DE' },
  { id: deId(164), name: 'Kaiserslautern', state: 'RP' satisfies GermanState, country: 'DE' },
  { id: deId(165), name: 'Worms', state: 'RP' satisfies GermanState, country: 'DE' },
  { id: deId(166), name: 'Neustadt an der Weinstraße', state: 'RP' satisfies GermanState, aliases: ['Neustadt an der Weinstrasse', 'Neustadt'], country: 'DE' },
  { id: deId(167), name: 'Speyer', state: 'RP' satisfies GermanState, country: 'DE' },
  { id: deId(168), name: 'Bad Kreuznach', state: 'RP' satisfies GermanState, country: 'DE' },
  { id: deId(169), name: 'Landau in der Pfalz', state: 'RP' satisfies GermanState, aliases: ['Landau'], country: 'DE' },
  { id: deId(170), name: 'Pirmasens', state: 'RP' satisfies GermanState, country: 'DE' },
  { id: deId(171), name: 'Bingen am Rhein', state: 'RP' satisfies GermanState, aliases: ['Bingen'], country: 'DE' },
  { id: deId(172), name: 'Jena', state: 'TH' satisfies GermanState, country: 'DE' },
  { id: deId(173), name: 'Weimar', state: 'TH' satisfies GermanState, country: 'DE' },

  // ===== SH (Schleswig-Holstein) =====
  { id: deId(174), name: 'Flensburg', state: 'SH' satisfies GermanState, country: 'DE' },
  { id: deId(175), name: 'Neumünster', state: 'SH' satisfies GermanState, aliases: ['Neumuenster'], country: 'DE' },
  { id: deId(176), name: 'Norderstedt', state: 'SH' satisfies GermanState, country: 'DE' },
  { id: deId(177), name: 'Elmshorn', state: 'SH' satisfies GermanState, country: 'DE' },
  { id: deId(178), name: 'Pinneberg', state: 'SH' satisfies GermanState, country: 'DE' },
  { id: deId(179), name: 'Ahrensburg', state: 'SH' satisfies GermanState, country: 'DE' },
  { id: deId(180), name: 'Itzehoe', state: 'SH' satisfies GermanState, country: 'DE' },
  { id: deId(181), name: 'Rendsburg', state: 'SH' satisfies GermanState, country: 'DE' },
  { id: deId(182), name: 'Husum', state: 'SH' satisfies GermanState, country: 'DE' },
  { id: deId(183), name: 'Bad Segeberg', state: 'SH' satisfies GermanState, country: 'DE' },

  // ===== HB (Bremen) =====
  { id: deId(184), name: 'Bremerhaven', state: 'HB' satisfies GermanState, country: 'DE' },

  // ===== BB (Brandenburg) =====
  { id: deId(185), name: 'Potsdam', state: 'BB' satisfies GermanState, country: 'DE' },
  { id: deId(186), name: 'Cottbus', state: 'BB' satisfies GermanState, country: 'DE' },
  { id: deId(187), name: 'Brandenburg an der Havel', state: 'BB' satisfies GermanState, aliases: ['Brandenburg'], country: 'DE' },
  { id: deId(188), name: 'Frankfurt (Oder)', state: 'BB' satisfies GermanState, aliases: ['Frankfurt Oder'], country: 'DE' },
  { id: deId(189), name: 'Oranienburg', state: 'BB' satisfies GermanState, country: 'DE' },
  { id: deId(190), name: 'Falkensee', state: 'BB' satisfies GermanState, country: 'DE' },
  { id: deId(191), name: 'Eberswalde', state: 'BB' satisfies GermanState, country: 'DE' },
  { id: deId(192), name: 'Bernau bei Berlin', state: 'BB' satisfies GermanState, aliases: ['Bernau'], country: 'DE' },
  { id: deId(193), name: 'Fürstenwalde/Spree', state: 'BB' satisfies GermanState, aliases: ['Fuerstenwalde'], country: 'DE' },
  { id: deId(194), name: 'Königs Wusterhausen', state: 'BB' satisfies GermanState, aliases: ['Koenigs Wusterhausen'], country: 'DE' },

  // ===== MV (Mecklenburg-Vorpommern) =====
  { id: deId(195), name: 'Schwerin', state: 'MV' satisfies GermanState, country: 'DE' },
  { id: deId(196), name: 'Neubrandenburg', state: 'MV' satisfies GermanState, country: 'DE' },
  { id: deId(197), name: 'Greifswald', state: 'MV' satisfies GermanState, country: 'DE' },
  { id: deId(198), name: 'Stralsund', state: 'MV' satisfies GermanState, country: 'DE' },
  { id: deId(199), name: 'Wismar', state: 'MV' satisfies GermanState, country: 'DE' },

  // ===== SL (Saarland) =====
  { id: deId(200), name: 'Saarbrücken', state: 'SL' satisfies GermanState, aliases: ['Saarbruecken'], country: 'DE' },
];

/**
 * Normalise la saisie : "Köln" == "Koeln" == "koln"
 * (utile pour matcher aliases et éviter les problèmes d'Umlaut)
 */
export function normalizeCityQuery(value: string): string {
  return (value || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
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