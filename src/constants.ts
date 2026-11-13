/** The home page lives at the site root, with no id in the address. */
export const HOME_PATH = '/';

// The address of each page, as it appears after the site's domain, for example techne.ph/network-buildout.
// HOME is only the old numeric home address, which redirects to HOME_PATH.
export const PANEL_IDS = {
  HOME: '184920573',
  SERVICES: 'services',
  PRICING: 'request-a-quote',
  BLOG: 'engagement',
  ABOUT: 'about',
  CONTACT: 'contact',
  IP_TRANSIT: 'ip-transit',
  DIA: 'dedicated-internet-access',
  COLOCATION: 'colocation',
  NETWORK_CONSULTING: 'network-consulting',
  CORE_CONFIG: 'core-network-configuration',
  DIST_CONFIG: 'distribution-configuration',
  SYSTEM_INTEGRATION: 'system-integration',
  PROTECTIVE_DNS: 'protective-dns',
  METRO_E: 'metro-e',
  VIRTUAL_CROSS_CONNECT: 'virtual-cross-connect',
  VIRTUAL_SWITCH: 'virtual-switch',
  VIRTUAL_ROUTER: 'virtual-router',
  CONTENT: 'content',
  NETWORK_BUILDOUT: 'network-buildout',
  FAQ: 'faq',
  CLIENTS: 'clients',
  PARTNERS: 'partners',
  TESTIMONIALS: 'testimonials',
};

/**
 * The numeric addresses the pages had before they were given words. A visitor, bookmark or search result that
 * still uses one is sent on to the page's new address. Do not remove these, or those links will stop working.
 */
export const LEGACY_PANEL_IDS: Record<string, Exclude<keyof typeof PANEL_IDS, 'HOME'>> = {
  '273645189': 'SERVICES',
  '519283746': 'PRICING',
  '394857261': 'BLOG',
  '485726391': 'ABOUT',
  '596847123': 'CONTACT',
  '617283945': 'IP_TRANSIT',
  '728394156': 'DIA',
  '839415267': 'COLOCATION',
  '941526378': 'NETWORK_CONSULTING',
  '112233445': 'CORE_CONFIG',
  '223344556': 'DIST_CONFIG',
  '334455667': 'SYSTEM_INTEGRATION',
  '445566778': 'PROTECTIVE_DNS',
  '990011223': 'METRO_E',
  '556677889': 'VIRTUAL_CROSS_CONNECT',
  '667788990': 'VIRTUAL_SWITCH',
  '778899001': 'VIRTUAL_ROUTER',
  '889900112': 'CONTENT',
  '151617181': 'NETWORK_BUILDOUT',
  '262728293': 'FAQ',
  '303132333': 'CLIENTS',
  '343536373': 'PARTNERS',
  '373839404': 'TESTIMONIALS',
};

/** The new address (without the leading slash) of a page that used to have a numeric one, or undefined. */
export const movedPageId = (oldId: string | undefined) =>
  oldId && Object.prototype.hasOwnProperty.call(LEGACY_PANEL_IDS, oldId) ? PANEL_IDS[LEGACY_PANEL_IDS[oldId]] : undefined;

/** Addresses of the blog articles that were removed. They redirect to the blog page. */
export const RETIRED_BLOG_IDS = ['100000001', '100000002', '100000003'];
