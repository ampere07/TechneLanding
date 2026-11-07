/**
 * Upstream networks shown on the location map, one for each country.
 * Only the networks marked unlocked are available. The rest are shown locked, as a preview.
 * AS numbers, names and countries were checked against bgp.he.net on 2026-11-07. Techne is AS131171, Techne Fiber.
 */
export interface TransitNetwork {
  asn: string;
  network: string;
  country: string;
  region: string;
  lon: number;
  lat: number;
  unlocked: boolean;
  /** Where the label sits, relative to its dot on the map. */
  side: 'left' | 'right' | 'top' | 'bottom';
}

/** Techne's own AS number, for the Philippines. */
export const HOME_NETWORK = { asn: 'AS131171', network: 'Techne Fiber', country: 'Philippines', lon: 121, lat: 14.6 };

export const TRANSIT_NETWORKS: TransitNetwork[] = [
  { asn: 'AS3491', network: 'PCCW Global', country: 'Hong Kong', region: 'Asia Pacific', lon: 114.2, lat: 22.3, unlocked: true, side: 'top' },
  { asn: 'AS1221', network: 'Telstra Limited', country: 'Australia', region: 'Asia Pacific', lon: 134, lat: -25, unlocked: true, side: 'top' },
  { asn: 'AS2516', network: 'KDDI', country: 'Japan', region: 'Asia Pacific', lon: 138, lat: 36, unlocked: false, side: 'right' },
  { asn: 'AS7473', network: 'Singapore Telecommunications', country: 'Singapore', region: 'Asia Pacific', lon: 103.8, lat: 1.35, unlocked: false, side: 'left' },
  { asn: 'AS4755', network: 'Tata Communications', country: 'India', region: 'Asia Pacific', lon: 78, lat: 21, unlocked: false, side: 'left' },
  { asn: 'AS1299', network: 'Arelion', country: 'Sweden', region: 'Europe', lon: 15, lat: 62, unlocked: false, side: 'top' },
  { asn: 'AS3320', network: 'Deutsche Telekom', country: 'Germany', region: 'Europe', lon: 10, lat: 51, unlocked: false, side: 'right' },
  { asn: 'AS5511', network: 'Orange (FTRSI)', country: 'France', region: 'Europe', lon: 2, lat: 46.5, unlocked: false, side: 'left' },
  { asn: 'AS6762', network: 'Telecom Italia Sparkle', country: 'Italy', region: 'Europe', lon: 12.5, lat: 42, unlocked: false, side: 'bottom' },
  { asn: 'AS3356', network: 'Lumen (Level 3)', country: 'United States', region: 'North America', lon: -98, lat: 39, unlocked: false, side: 'top' },
];
