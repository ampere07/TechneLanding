/**
 * Techne client sites shown on the zoomed Philippines map.
 * PLACEHOLDERS: the names and the list of cities are examples only. Replace them with real clients,
 * keeping the longitude and latitude of each site. Within a region, list sites from north to south.
 */
export type Region = 'Luzon' | 'Visayas' | 'Mindanao';

export interface ClientSite {
  name: string;
  city: string;
  type: 'ISP' | 'Enterprise';
  region: Region;
  lon: number;
  lat: number;
}

export const REGIONS: Region[] = ['Luzon', 'Visayas', 'Mindanao'];

export const CLIENT_SITES: ClientSite[] = [
  { name: 'Client name', city: 'Baguio', type: 'ISP', region: 'Luzon', lon: 120.6, lat: 16.4 },
  { name: 'Client name', city: 'Clark, Pampanga', type: 'Enterprise', region: 'Luzon', lon: 120.55, lat: 15.18 },
  { name: 'Client name', city: 'Manila', type: 'ISP', region: 'Luzon', lon: 121.0, lat: 14.6 },
  { name: 'Client name', city: 'Legazpi', type: 'ISP', region: 'Luzon', lon: 123.75, lat: 13.14 },
  { name: 'Client name', city: 'Iloilo', type: 'Enterprise', region: 'Visayas', lon: 122.57, lat: 10.72 },
  { name: 'Client name', city: 'Tacloban', type: 'ISP', region: 'Visayas', lon: 125.0, lat: 11.24 },
  { name: 'Client name', city: 'Cebu City', type: 'ISP', region: 'Visayas', lon: 123.89, lat: 10.32 },
  { name: 'Client name', city: 'Cagayan de Oro', type: 'Enterprise', region: 'Mindanao', lon: 124.64, lat: 8.48 },
  { name: 'Client name', city: 'Davao', type: 'ISP', region: 'Mindanao', lon: 125.46, lat: 7.07 },
  { name: 'Client name', city: 'Zamboanga', type: 'Enterprise', region: 'Mindanao', lon: 122.08, lat: 6.91 },
];
