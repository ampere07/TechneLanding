import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { PANEL_IDS } from '../constants';
import { postBySlug } from '../content/blog';
import { partnerBySlug } from '../content/partners';
import { CONTACT, SERVICES } from '../content/site';

/** The address of the live site. Search engines are told that each page's real address starts with this. */
export const SITE_URL = 'https://techne.ph';

interface PageMeta {
  title: string;
  description: string;
}

/** Cuts a description to about the length a search result shows, at a word boundary. */
const clip = (text: string, max = 158) => {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(' '))}…`;
};

const HOME: PageMeta = {
  title: 'Techne | IP Transit, Colocation & Network Consulting in the Philippines',
  description:
    'Techne is a carrier-neutral network provider in the Philippines: IP transit, Metro-E, colocation, content access, virtual interconnection and network consulting, with a 24/7 NOC.',
};

/** Titles and descriptions for the pages that are not a service. Each page reads its own words from here. */
const PAGES: Record<string, PageMeta> = {
  [PANEL_IDS.SERVICES]: {
    title: 'Services | Techne',
    description: 'Colocation, connectivity, virtual services and network consulting for ISPs and enterprises in the Philippines, all on one carrier-neutral network.',
  },
  [PANEL_IDS.PRICING]: {
    title: 'Request a Quote | Techne',
    description: 'Request a quote for IP transit, Metro-E, colocation, virtual services or network consulting from Techne. We respond to new inquiries within 24 hours.',
  },
  [PANEL_IDS.BLOG]: {
    title: 'Engagement | Techne',
    description: 'Articles on Techne’s work in peering advocacy, internet exchange connectivity and BGP operations across the Philippines.',
  },
  [PANEL_IDS.ABOUT]: {
    title: 'About Techne | Network Engineering in the Philippines',
    description: 'Techne Consulting was shaped by more than a decade of hands-on network engineering experience across different environments, industries and geographies.',
  },
  [PANEL_IDS.CONTACT]: {
    title: 'Contact Techne | Network Services in the Philippines',
    description: `Contact Techne about IP transit, colocation, Metro-E and network consulting. Call ${CONTACT.phoneDisplay} or email ${CONTACT.email}.`,
  },
  [PANEL_IDS.NETWORK_BUILDOUT]: {
    title: 'Network Buildout | Completed ISP Deployments | Techne',
    description: 'Completed network deployments by Techne for ISPs across the Philippines: core and distribution networks, monitoring, data center presence and DWDM transport.',
  },
  [PANEL_IDS.FAQ]: {
    title: 'FAQ | Techne',
    description: 'Answers about where Techne operates, IP transit requirements, NTC compliance and how we work with your network.',
  },
  [PANEL_IDS.CLIENTS]: {
    title: 'Our Clients | Techne',
    description: 'Where Techne’s clients are across Luzon, Visayas and Mindanao, with the network consulting and internet services they use.',
  },
  [PANEL_IDS.TESTIMONIALS]: {
    title: 'Client Testimonials | Techne',
    description: 'What ISP and network clients say about working with Techne, in their own words.',
  },
  [PANEL_IDS.DIA]: {
    title: 'Dedicated Internet Access in the Philippines | Techne',
    description: 'Symmetrical, high-speed internet reserved exclusively for your business, with guaranteed bandwidth and enterprise-level reliability.',
  },
  [PANEL_IDS.CORE_CONFIG]: {
    title: 'Core Network Configuration | Techne',
    description: 'Backbone and core router configuration services for maximum network stability and throughput.',
  },
  [PANEL_IDS.DIST_CONFIG]: {
    title: 'Distribution Configuration | Techne',
    description: 'A scalable, resilient distribution layer that bridges your core infrastructure to your access network, for ISPs, enterprises and carriers.',
  },
  [PANEL_IDS.SYSTEM_INTEGRATION]: {
    title: 'System Integration | Techne',
    description: 'Deploying and optimizing enterprise-grade monitoring and operations tools that bring IT systems and network infrastructure together.',
  },
  [PANEL_IDS.PROTECTIVE_DNS]: {
    title: 'Protective DNS Integration | NTC Compliance | Techne',
    description: 'A fully integrated Protective DNS solution that helps service providers meet NTC Memorandum No. 001-01-2025 and protect subscribers.',
  },
};

/** The title and description for an address on the site. */
export const metaFor = (pathname: string): PageMeta => {
  const [id, slug] = pathname.split('/').filter(Boolean);
  if (!id) return HOME;

  if (slug && id === PANEL_IDS.BLOG) {
    const post = postBySlug(slug);
    if (post) return { title: `${post.title} | Techne`, description: clip(post.summary) };
  }
  if (slug && id === PANEL_IDS.PARTNERS) {
    const partner = partnerBySlug(slug);
    if (partner) {
      return {
        title: `${partner.name} | Techne Partners`,
        description: clip(partner.summary ?? `${partner.name} is one of the partners Techne works with.`),
      };
    }
  }

  const service = SERVICES.find((item) => item.path === `/${id}`);
  if (service) return { title: `${service.name} in the Philippines | Techne`, description: clip(service.summary) };

  return PAGES[id] ?? HOME;
};

/** Sets, or creates, a tag in the page's head. */
const setTag = (selector: string, create: () => HTMLElement, attribute: string, value: string) => {
  let element = document.head.querySelector<HTMLElement>(selector);
  if (!element) {
    element = create();
    document.head.appendChild(element);
  }
  element.setAttribute(attribute, value);
};

const meta = (key: 'name' | 'property', name: string) => () => {
  const element = document.createElement('meta');
  element.setAttribute(key, name);
  return element;
};

/**
 * Keeps the browser tab title and the search and sharing tags in step with the page being shown. Search engines
 * that run the page's code read these, and so do bookmarks and the browser's history.
 */
export const Seo: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    const { title, description } = metaFor(pathname);
    const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : '';
    const address = path === '' ? `${SITE_URL}/` : `${SITE_URL}${path}`;

    document.title = title;
    setTag('meta[name="description"]', meta('name', 'description'), 'content', description);
    setTag('link[rel="canonical"]', () => Object.assign(document.createElement('link'), { rel: 'canonical' }), 'href', address);
    setTag('meta[property="og:title"]', meta('property', 'og:title'), 'content', title);
    setTag('meta[property="og:description"]', meta('property', 'og:description'), 'content', description);
    setTag('meta[property="og:url"]', meta('property', 'og:url'), 'content', address);
    setTag('meta[name="twitter:title"]', meta('name', 'twitter:title'), 'content', title);
    setTag('meta[name="twitter:description"]', meta('name', 'twitter:description'), 'content', description);
  }, [pathname]);
  return null;
};
