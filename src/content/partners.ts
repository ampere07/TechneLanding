import googleLogo from '../assets/partners/google.svg';
import metaLogo from '../assets/partners/meta.png';
import riseLogo from '../assets/partners/rise.svg';
import syncLogo from '../assets/partners/sync-icon.png';
import telstraLogo from '../assets/partners/telstra.svg';
import vitroLogo from '../assets/partners/vitro.png';

/**
 * Partners shown under the intro on the About page. Logos are in src/assets/partners/. They are the marks only.
 * A partner opens its own page only when it has `about` text. Without it the logo is shown but is not a link.
 * `type`, `summary`, `highlights` and `website` are optional and are shown on the partner's page only when filled in.
 * `darkLogo` is true for a logo drawn in black or very dark colours: in dark mode it is turned white.
 * With no `src` the partner's name is shown as text.
 */
export interface Partner {
  slug: string;
  name: string;
  /** What kind of partner this is, in a few words. */
  type?: string;
  /** One line, shown at the top of the partner's page. */
  summary?: string;
  /** The longer description, one paragraph per item. */
  about?: string[];
  src?: string;
  darkLogo?: boolean;
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
    slug: "telstra",
    name: "Telstra",
    type: "Telecommunications",
    summary: "Australia's largest telecommunications company.",
    website: "https://www.telstra.com",
    src: telstraLogo,
    about: [
      "Telstra is an Australian telecommunications company that provides mobile, fixed-line and internet services, and runs international networks that connect Australia and Asia to the rest of the world.",
      "Telstra is one of the partners Techne works with. For networks in the Philippines, a partner with reach across the Asia-Pacific region helps connect local traffic to the wider internet.",
    ],
  },
  {
    slug: "rise",
    name: "RISE",
    type: "Internet provider and exchange",
    summary: "A Philippine internet service provider.",
    website: "https://rise.ph",
    src: riseLogo,
    darkLogo: true,
    about: [
      "RISE is a Philippine internet service provider. It serves businesses, government and schools with high-speed internet, and is part of a group that also runs GetaFIX, a carrier-neutral internet exchange in the Philippines, and an open access fibre network.",
      "RISE is one of the partners Techne works with. Techne and RISE both work to keep Philippine internet traffic local, fast and reliable.",
    ],
  },
  {
    slug: "vitro",
    name: "Vitro",
    type: "Data center",
    summary: "The data center where Techne delivers its services.",
    website: "https://vitrodc.com",
    src: vitroLogo,
    darkLogo: true,
    about: [
      "VITRO is the data center brand of ePLDT, the enterprise arm of PLDT. Its facilities in Metro Manila and other parts of the Philippines host servers and networking equipment for carriers, enterprises and cloud providers.",
      "Techne delivers its services from VITRO Makati 2 in Makati, Manila. Hosting there places Techne's equipment close to the carriers, networks and content providers that connect in the same building.",
    ],
    highlights: ["VITRO Makati 2, Makati City, Manila", "Colocation space for carriers and enterprises", "Where Techne delivers its network services"],
  },
  {
    slug: "google",
    name: "Google",
    type: "Content and cloud",
    summary: "A global technology company, and a source of the content our clients use every day.",
    website: "https://www.google.com",
    src: googleLogo,
    about: [
      "Google is a global technology company known for Search, YouTube, Android and Google Cloud. Much of the traffic on an ISP's network is content from Google's services.",
      "Google is one of the partners Techne works with. Techne's content services give ISPs direct access to content from networks such as Google, which keeps popular traffic closer to subscribers and off expensive transit links.",
    ],
  },
  {
    slug: "meta",
    name: "Meta",
    type: "Content",
    summary: "The company behind Facebook, Instagram and WhatsApp.",
    website: "https://www.meta.com",
    src: metaLogo,
    darkLogo: true,
    about: [
      "Meta is the company behind Facebook, Instagram, WhatsApp and Messenger. Its apps are among the most used in the Philippines, so they make up a large share of the traffic on Philippine networks.",
      "Meta is one of the partners Techne works with, and it is one of the content networks Techne connects to directly. Direct connections keep that traffic local for subscribers.",
    ],
  },
];

export const partnerBySlug = (slug: string | undefined) => PARTNERS.find((partner) => partner.slug === slug);
