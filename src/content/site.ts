import { PANEL_IDS } from '../constants';
import type { FabricFocus } from '../three/FabricStage';

/**
 * Single source of truth for service names, descriptions and company facts.
 * The home page, navigation, footer, services index and service pages all read
 * from here, so a change in one place shows up everywhere.
 */

export interface ServiceSummary {
  id: Exclude<FabricFocus, 'overview'>;
  name: string;
  group: string;
  summary: string;
  builtFor: string;
  menuLine: string;
  path: string;
}

export const SERVICES: ServiceSummary[] = [
  {
    id: 'colocation',
    name: 'Colocation',
    group: 'Data center',
    summary:
      'Rack space with redundant power and controlled cooling for your routers, switches and servers, in facilities where you can cross-connect to carriers and to the Techne network.',
    builtFor: 'ISP core and edge, DNS, monitoring and security platforms',
    menuLine: 'Rack space, power and cross-connects',
    path: `/${PANEL_IDS.COLOCATION}`,
  },
  {
    id: 'ip-transit',
    name: 'IP Transit',
    group: 'Connectivity',
    summary:
      'Full-table BGP upstream over diverse paths, on ports from 1 Gbps to 100 Gbps. You bring your ASN and IP resources, and we carry your traffic to the global internet.',
    builtFor: 'ISPs, hosting providers, content networks and enterprises with an ASN',
    menuLine: 'BGP upstream on 1 to 100 Gbps ports',
    path: `/${PANEL_IDS.IP_TRANSIT}`,
  },
  {
    id: 'content',
    name: 'Content',
    group: 'Connectivity',
    summary:
      'Direct access to CDN caches and content networks, so popular traffic reaches your subscribers locally and stays off your upstream links.',
    builtFor: 'ISPs and access networks with heavy streaming and gaming traffic',
    menuLine: 'CDN caches and content peering',
    path: `/${PANEL_IDS.CONTENT}`,
  },
  {
    id: 'vxc',
    name: 'Virtual Cross Connect',
    group: 'Virtual services',
    summary:
      'A private Layer 2 connection between two ports on the Techne fabric. Reach a carrier, a partner or your own equipment in another facility without ordering a new fiber run.',
    builtFor: 'Networks that need a private link to a partner or another site',
    menuLine: 'Private Layer 2 link between two ports',
    path: `/${PANEL_IDS.VIRTUAL_CROSS_CONNECT}`,
  },
  {
    id: 'vswitch',
    name: 'Virtual Switch',
    group: 'Virtual services',
    summary:
      'A private Layer 2 domain hosted on the fabric. Join several ports, sites or partners as if they were patched into the same switch.',
    builtFor: 'Multi-site networks and groups of partners sharing a private LAN',
    menuLine: 'Private Layer 2 domain across sites',
    path: `/${PANEL_IDS.VIRTUAL_SWITCH}`,
  },
  {
    id: 'vrouter',
    name: 'Virtual Router',
    group: 'Virtual services',
    summary:
      'A hosted routing instance with BGP and dual-stack IPv4 and IPv6. Add routing at a location without buying or installing router hardware.',
    builtFor: 'Teams adding a site or gateway without new hardware',
    menuLine: 'Hosted BGP routing, no hardware',
    path: `/${PANEL_IDS.VIRTUAL_ROUTER}`,
  },
  {
    id: 'consulting',
    name: 'Network Consulting',
    group: 'Advisory',
    summary:
      'Vendor-neutral design, routing reviews, audits and NTC compliance support, delivered with documentation your team keeps.',
    builtFor: 'ISPs, telcos, enterprises and financial institutions',
    menuLine: 'Design, audit and compliance support',
    path: `/${PANEL_IDS.NETWORK_CONSULTING}`,
  },
];

export const SERVICE_GROUPS = ['Data center', 'Connectivity', 'Virtual services', 'Advisory'];

export const serviceById = (id: ServiceSummary['id']) => {
  const found = SERVICES.find((service) => service.id === id);
  if (!found) throw new Error(`Unknown service: ${id}`);
  return found;
};

export const CONTACT = {
  phoneDisplay: '+63 968 702 8433',
  phoneHref: 'tel:+639687028433',
  salesEmail: 'cliff@technefiber.com',
  generalEmail: 'info@technefiber.com',
  city: 'Cebu City, Philippines',
  facebook: 'https://www.facebook.com/techne.consulting',
};

/** Network figures used across the site. Change them here to change them everywhere. */
export const FACTS = {
  backbone: '200+ Gbps',
  ports: '1 to 100 Gbps',
  sla: '99.9%',
  noc: '24/7',
  networks: '32+',
};

export interface Location {
  city: string;
  region: string;
  facilities: string[];
  colocation: boolean;
}

/** Service availability by metro. Colocation is offered in the Philippine metros only. */
export const LOCATIONS: Location[] = [
  {
    city: 'Manila',
    region: 'Philippines',
    facilities: ['Vitro Makati 1', 'Vitro Makati 2', 'Vitro Pasig', 'Vitro Parañaque', 'TIM Carmona', 'Globe MK2'],
    colocation: true,
  },
  { city: 'Cebu City', region: 'Philippines', facilities: ['Vitro Cebu', 'Globe Cebu'], colocation: true },
  { city: 'Davao City', region: 'Philippines', facilities: ['Vitro Davao', 'Globe Davao'], colocation: true },
  { city: 'Hong Kong', region: 'International', facilities: ['Equinix HK1', 'Mega-i Advantage'], colocation: false },
  {
    city: 'Singapore',
    region: 'International',
    facilities: ['Equinix SG1', 'Global Switch Singapore'],
    colocation: false,
  },
];

export const FACILITY_COUNT = LOCATIONS.reduce((total, location) => total + location.facilities.length, 0);

export const LOCATION_NAMES = 'Manila, Cebu City, Davao City, Hong Kong and Singapore';

export const PEERED_NETWORKS = [
  'Alibaba',
  'Amazon',
  'Facebook',
  'Fastly',
  'Google',
  'Riot Games',
  'Swarmify',
  'Tencent',
  'TikTok',
  'Twitch',
  'Zenlayer',
];

export const CACHED_CONTENT = ['Akamai', 'Cloudflare', 'Facebook', 'Google', 'Microsoft', 'Steam'];

export const ENGAGEMENT_STEPS = [
  {
    title: 'Assess',
    desc: 'We review your current topology, traffic profile and growth targets before proposing anything.',
  },
  {
    title: 'Design',
    desc: 'We produce a standards-based design with capacity headroom and clear documentation.',
  },
  {
    title: 'Deploy',
    desc: 'We provision, configure and migrate, with a cutover plan and a rollback path.',
  },
  {
    title: 'Operate',
    desc: 'Our 24/7 NOC monitors the service after go-live, with maintenance and SLA-backed incident response.',
  },
];
