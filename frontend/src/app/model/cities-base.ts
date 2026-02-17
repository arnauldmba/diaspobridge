export interface BaseCity {
  id: number;
  name: string;
  aliases?: string[];
  state?: string;   // pour Allemagne
  region?: string;  // pour Cameroun
}