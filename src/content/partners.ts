import atssFiberLogo from '../assets/partners/atss-fiber.png';
import syncLogo from '../assets/partners/sync-icon.png';

/**
 * Partners shown under the intro on the About page. Each one opens its own page.
 * Logos are in src/assets/partners/. They are the marks only, with no text in the image.
 * `highlights` and `website` are optional. They are shown on the partner's page only when they are filled in.
 */
export interface Partner {
  slug: string;
  name: string;
  /** What kind of partner this is, in a few words. */
  type: string;
  /** One line, shown on the About page and at the top of the partner's page. */
  summary: string;
  /** The longer description, one paragraph per item. */
  about: string[];
  src?: string;
  highlights?: string[];
  website?: string;
}

export const PARTNERS: Partner[] = [
  {
    slug: 'sync',
    name: 'Sync',
    type: 'Billing system for ISPs',
    summary: 'A billing system for ISP companies.',
    website: 'https://synced.ph',
    src: syncLogo,
    about: [
      'Sync is a billing system built for ISP companies. It brings an operator’s subscribers, billing, statements and invoices into one place, so the people running an ISP can see what is owed, what has been paid and who is active without keeping separate records.',
      'Each ISP works in its own database, separate from every other operator on the platform, and access is controlled by role. An operator signs in and sees only its own subscribers, billing and reports.',
      'Sync is one of the partners Techne works with. Techne builds and supports the network, and Sync gives the ISP the billing side of the business.',
    ],
    highlights: [
      'Subscriber records and active-user tracking',
      'Billing, statements of account and invoices',
      'Analytics dashboard for each ISP',
      'A separate database for every operator',
      'Role-based access, so each user sees only what they should',
    ],
  },
  {
    slug: 'atss-fiber',
    name: 'ATSS Fiber',
    type: 'Internet provider',
    summary: 'An internet provider.',
    website: 'https://atssfiber.ph',
    src: atssFiberLogo,
    about: [
      'ATSS Fiber is an internet provider that brings fibre internet to homes and businesses. Subscribers can apply online: they enter their details, pin the installation address on a map, choose a plan and upload the documents needed to process the application.',
      'The application checks the pinned location against the areas ATSS Fiber covers, so a customer outside coverage is told straight away instead of waiting for a reply.',
      'ATSS Fiber is one of the partners Techne works with, and its network is the kind of ISP infrastructure Techne designs and supports.',
    ],
    highlights: [
      'Fibre internet for homes and businesses',
      'Online application with the installation address pinned on a map',
      'Plan selection during the application',
      'Instant check of whether the address is within coverage',
    ],
  },
];

export const partnerBySlug = (slug: string | undefined) => PARTNERS.find((partner) => partner.slug === slug);
