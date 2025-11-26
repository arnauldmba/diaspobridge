export interface CountrySearchCriteria {
  origin?: string;      // pays d'origine (ex: "Germany")
  dest?: string;        // pays de destination (ex: "Cameroon")
  page?: number;        // index de page (0, 1, 2...)
  size?: number;        // taille de page (10, 20...)
  activeOnly?: boolean; // true = seulement les annonces actives
}