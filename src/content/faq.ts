/**
 * Frequently asked questions, shown on the FAQ page and, in part, on the home page.
 * To add a question, add it to a group. Answers should state only what Techne can stand behind.
 */
export interface FaqItem {
  q: string;
  a: string;
}

export interface FaqGroup {
  title: string;
  items: FaqItem[];
}

export const FAQ_GROUPS: FaqGroup[] = [
  {
    title: 'Getting started',
    items: [
      {
        q: 'Where does Techne operate?',
        a: 'Our services are delivered from Vitro Makati 2 in Manila. If your site is somewhere else, tell us where it is and we will check what can reach it.',
      },
      {
        q: 'Who are your services for?',
        a: 'ISPs, enterprises, telcos and financial institutions that need reliable, compliant network infrastructure.',
      },
      {
        q: 'How quickly do you respond?',
        a: 'We respond to new inquiries within 24 hours, and our NOC operates 24/7. For an urgent network issue, please call us.',
      },
    ],
  },
  {
    title: 'Network and services',
    items: [
      {
        q: 'Do I need my own ASN for IP Transit?',
        a: 'Yes. Full BGP transit needs a public ASN and your own IPv4 and IPv6 resources. If you are starting out, we can advise on APNIC registration and interim addressing.',
      },
      {
        q: 'What is the difference between IP Transit and Content?',
        a: 'IP Transit gives you reach to the whole internet. Content gives you direct access to CDN caches and content networks, which moves popular traffic off your transit links. Many networks buy both.',
      },
      {
        q: 'Can you work with our existing network?',
        a: 'Yes. We are vendor-neutral and design around the equipment and topology you already run.',
      },
    ],
  },
  {
    title: 'Compliance',
    items: [
      {
        q: 'Do you handle NTC compliance?',
        a: 'Yes, including Protective DNS integration aligned with NTC Memorandum No. 001-01-2025, plus data-privacy requirements.',
      },
    ],
  },
];
