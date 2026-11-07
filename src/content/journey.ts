import negros from '../assets/about/2013.jpg';
import papuaNewGuinea from '../assets/about/2017.jpg';
import exchangeTalk from '../assets/about/2019.jpg';
import walkthrough from '../assets/about/latest.jpg';

/** The story of how Techne came to be. Text can mark *italic* and **bold** with asterisks. */
export interface JourneyStep {
  year: string;
  image: string;
  alt: string;
  caption?: string;
  /** Which part of the picture stays in view when it is cropped. */
  focus: string;
  /** The facts of the year at a glance. Every one comes from the paragraph beside it. */
  facts: { label: string; value: string }[];
  paragraphs: string[];
}

export const JOURNEY_TITLE = 'The Journey Behind Techne';

export const JOURNEY_INTRO =
  'Techne Consulting was shaped by more than a decade of hands-on network engineering experience across different environments, industries, and geographies.';

export const JOURNEY: JourneyStep[] = [
  {
    year: '2013',
    image: negros,
    alt: 'A technician high on a pole among trees, fitting a wireless antenna',
    caption: 'Negros Oriental',
    focus: 'center 28%',
    facts: [
      { label: 'Where', value: 'Negros Oriental' },
      { label: 'Role', value: 'Junior Network Administrator' },
      { label: 'Built', value: 'Campus networks and wireless site-to-site links' },
    ],
    paragraphs: [
      'The journey began in *2013 in Negros Oriental*, working as a *Junior Network Administrator* and helping build campus networks and wireless infrastructure for site-to-site interconnection. This early experience established a strong foundation in practical network deployment, connectivity, and infrastructure operations.',
    ],
  },
  {
    year: '2017',
    image: papuaNewGuinea,
    alt: 'An engineer in a work uniform connecting cables inside an equipment cabinet',
    caption: 'Papua New Guinea',
    focus: 'center 45%',
    facts: [
      { label: 'Where', value: 'Papua New Guinea' },
      { label: 'Role', value: 'Head of Network' },
      { label: 'Industry', value: 'Oil and gas' },
      { label: 'Links', value: 'VSAT back to Canada and Australia' },
    ],
    paragraphs: [
      'In *2017*, the journey expanded internationally to *Papua New Guinea*, serving as *Head of Network* for projects supporting the oil and gas industry. Operating in remote jungle environments, network connectivity had to link rig sites back to networks in *Canada and Australia* using VSAT. In an environment where bandwidth was limited and expensive, *every bit per second mattered*. This experience strengthened the focus on efficiency, resilience, optimization, and careful use of network resources.',
    ],
  },
  {
    year: '2019',
    image: exchangeTalk,
    alt: 'A speaker on stage beside a slide that compares ISP paths with an Internet Exchange',
    focus: 'center 45%',
    facts: [
      { label: 'Where', value: 'The Philippines' },
      { label: 'Focus', value: 'Telecommunications and Internet Exchanges' },
      { label: 'Mission', value: 'Peering, local traffic exchange, and smarter routing' },
    ],
    paragraphs: [
      'By *2019*, the journey returned to the Philippines and shifted toward the telecommunications and Internet Exchange ecosystem. The mission became broader: helping accelerate Internet development in the country by promoting better interconnection and educating ISP operators on the importance of *peering, local traffic exchange, and smarter routing*.',
    ],
  },
];

/** The last part of the story, which ends with Techne Consulting in 2024. */
export const JOURNEY_FINAL = {
  year: '2024',
  image: walkthrough,
  alt: 'A presenter in a dark polo shirt explains a network setup beside a wall of monitoring screens',
  paragraphs: [
    'Years of working with ISPs, telcos, Internet Exchanges, and service provider networks revealed a recurring challenge: many operators were growing rapidly, but their network architecture, routing policies, monitoring, redundancy, and operational practices were not always evolving at the same pace.',
  ],
  founding: 'This led to the establishment of *Techne Consulting in 2024*.',
  purpose:
    'Techne was created as a network consulting company with a clear purpose: *to help ISP operators build telco-grade networks capable of delivering reliable and high-quality Internet services, especially in underserved areas of the Philippines.*',
  closing:
    'From campus networks, to remote VSAT deployments, to telecommunications and Internet Exchange infrastructure, each stage of the journey contributed to the foundation of Techne today.',
};
