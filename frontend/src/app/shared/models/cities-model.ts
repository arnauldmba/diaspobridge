export interface BaseCity {
  id: string;
  name: string;
  aliases?: string[];
  state?: string;
  region?: string;
  country: 'DE' | 'CM';
}