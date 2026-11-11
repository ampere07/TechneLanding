/**
 * Techne client areas shown on the zoomed Philippines map. Each area is a place where Techne has clients, and the
 * services it has there. Within a region, areas are listed in the order given by Techne.
 * The longitude and latitude are the approximate centre of each area, used to place the pin.
 */
export type Region = 'Luzon' | 'Visayas' | 'Mindanao';
export type Service = 'Network Consulting' | 'Internet';

export const REGIONS: Region[] = ['Luzon', 'Visayas', 'Mindanao'];
export const SERVICES: Service[] = ['Network Consulting', 'Internet'];

export interface ClientSite {
  /** The area, as it is shown in the list and on the pin. */
  name: string;
  region: Region;
  services: Service[];
  lon: number;
  lat: number;
}

const NC: Service[] = ['Network Consulting'];
const BOTH: Service[] = ['Network Consulting', 'Internet'];

export const CLIENT_SITES: ClientSite[] = [
  // Luzon
  { name: 'Caloocan', region: 'Luzon', services: BOTH, lon: 120.97, lat: 14.65 },
  { name: 'Rizal', region: 'Luzon', services: BOTH, lon: 121.3, lat: 14.6 },
  { name: 'Laguna', region: 'Luzon', services: BOTH, lon: 121.33, lat: 14.17 },
  { name: 'Pampanga', region: 'Luzon', services: BOTH, lon: 120.65, lat: 15.05 },
  { name: 'Bulacan', region: 'Luzon', services: BOTH, lon: 120.85, lat: 14.85 },
  { name: 'Nueva Ecija', region: 'Luzon', services: NC, lon: 121.0, lat: 15.58 },
  { name: 'Pangasinan', region: 'Luzon', services: NC, lon: 120.35, lat: 15.9 },
  { name: 'Cavite', region: 'Luzon', services: NC, lon: 120.9, lat: 14.28 },
  { name: 'Bicol', region: 'Luzon', services: NC, lon: 123.75, lat: 13.14 },
  { name: 'Makati', region: 'Luzon', services: BOTH, lon: 121.02, lat: 14.55 },
  // Visayas
  { name: 'Ormoc, Leyte', region: 'Visayas', services: NC, lon: 124.6, lat: 11.0 },
  { name: 'Maasin, Leyte', region: 'Visayas', services: NC, lon: 124.84, lat: 10.13 },
  { name: 'Bohol', region: 'Visayas', services: BOTH, lon: 124.2, lat: 9.85 },
  { name: 'Aklan', region: 'Visayas', services: NC, lon: 122.37, lat: 11.7 },
  // Mindanao
  { name: 'Samal', region: 'Mindanao', services: NC, lon: 125.72, lat: 7.07 },
  { name: 'Zamboanga', region: 'Mindanao', services: BOTH, lon: 122.08, lat: 6.91 },
  { name: 'Basilan', region: 'Mindanao', services: BOTH, lon: 122.0, lat: 6.55 },
  { name: 'Jolo', region: 'Mindanao', services: BOTH, lon: 121.0, lat: 6.05 },
  { name: 'Surigao', region: 'Mindanao', services: NC, lon: 125.5, lat: 9.78 },
];
