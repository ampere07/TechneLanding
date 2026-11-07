import luzonTalk from '../assets/blog/1st.jpg';
import ixDiagramTalk from '../assets/blog/1stt.jpg';
import itapSpeaker from '../assets/blog/2nd.jpg';
import itapSmile from '../assets/blog/2ndd.jpg';
import itapAudience from '../assets/blog/2nddd.jpg';
import itapRoom from '../assets/blog/2ndddd.jpg';
import bgpTitle from '../assets/blog/3rdd.jpg';
import bgpRules from '../assets/blog/3rd.jpg';

/**
 * A piece of an article, in the order it is shown. Text can mark *italic* and **bold** with asterisks,
 * and can link to another article with [words](post:the-article-slug).
 */
export type BlogBlock =
  | { type: 'p'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'figure'; src: string; alt: string; caption: string }
  | { type: 'callout'; text: string }
  | { type: 'quote'; text: string };

export interface BlogPost {
  slug: string;
  title: string;
  summary: string;
  /** The event the article is about, and when it took place. */
  event: string;
  date: string;
  /** The picture on the article's card in the list. */
  image: string;
  blocks: BlogBlock[];
  /** Links to the events, when there are any. */
  eventsHeading?: string;
  events?: { label: string; href: string }[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'from-peering-advocacy-to-practical-bgp-operations',
    title: 'From Peering Advocacy to Practical BGP Operations',
    event: '3rd ITAP General Assembly, Mindanao',
    date: 'September 24–25, 2026',
    summary:
      'At the 3rd ITAP General Assembly in Mindanao, Cliff Perez presented, under Techne Consulting, why a BGP session that shows Established can still carry a poor routing policy.',
    image: bgpTitle,
    blocks: [
      {
        type: 'p',
        text: 'The progression of Techne Consulting’s industry advocacy continued during the *3rd ITAP General Assembly in Mindanao*, held on *September 24–25, 2026*.',
      },
      {
        type: 'p',
        text: 'At this stage, *Cliff Perez* was no longer representing any Internet Exchanges Organization. Instead, he carried the experience and lessons gained from practical experience and forward under *Techne Consulting*, presenting the topic:',
      },
      { type: 'callout', text: '*“Beyond ‘Established’: MikroTik BGP Mistakes That Break ISP Networks.”*' },
      {
        type: 'figure',
        src: bgpTitle,
        alt: 'A speaker with a microphone beside a screen titled Beyond Established Mikrotik BGP Mistakes That Break ISP Networks, with the Techne logo, at the 3rd General Assembly and Tech Exhibit 2026',
        caption: 'Presenting at the 3rd General Assembly and Tech Exhibit, September 24–25, 2026',
      },
      {
        type: 'p',
        text: 'The session focused on a practical challenge faced by many growing ISPs: a BGP session may show *Established*, but that does not necessarily mean the routing policy is correct, optimized, or safe.',
      },
      {
        type: 'p',
        text: 'The presentation highlighted common BGP mistakes made by network operators, including improper route filtering, incorrect path selection, weak routing policies, and underutilized BGP features. It also emphasized how these issues can directly affect the utilization of Internet Exchange connections in the Philippines.',
      },
      {
        type: 'p',
        text: 'A key message of the session was that connecting to an IX is only the first step. To fully benefit from peering, operators must understand how to properly control route advertisements, apply filtering, manage local preference and AS-PATH policies, use BGP communities, and verify that traffic is actually following the intended peering path.',
      },
      {
        type: 'figure',
        src: bgpRules,
        alt: 'A speaker in front of two slides of MikroTik routing filter rules, one for IP transit received routes and one for IP transit advertised routes',
        caption: 'Walking through route filter rules for IP transit, received and advertised',
      },
      { type: 'p', text: 'This presentation represented the next stage of a continuing journey.' },
      { type: 'p', text: 'In [*2023*](post:early-advocacy-for-internet-exchange-connectivity), the focus was on explaining *why ISPs should connect to an Internet Exchange*.' },
      {
        type: 'p',
        text: 'In [*2025*](post:from-peering-advocacy-to-building-a-community-internet-exchange), the discussion expanded toward *making affordable content and peering access more accessible through Maharlika Internet Exchange*.',
      },
      {
        type: 'p',
        text: 'By *2026*, through *Techne Consulting*, the focus had evolved further—from simply encouraging IX participation to helping ISP operators *use BGP and peering more effectively, securely, and efficiently*.',
      },
      { type: 'p', text: 'The message remained consistent throughout:' },
      {
        type: 'quote',
        text: '*Peering creates opportunity, but proper routing engineering is what allows an ISP to realize its full value.*',
      },
      {
        type: 'p',
        text: 'Through Techne Consulting, this advocacy now continues with a broader objective: helping Philippine ISPs improve not only how they connect, but how they design, operate, secure, and optimize their networks for long-term growth.',
      },
    ],
  },
  {
    slug: 'from-peering-advocacy-to-building-a-community-internet-exchange',
    title: 'From Peering Advocacy to Building a Community Internet Exchange',
    event: '2nd ITAP General Assembly, Cebu',
    date: 'April 25–26, 2025',
    summary:
      'At the 2nd ITAP General Assembly in Cebu, Cliff Richard Perez Jr. presented Maharlika Internet Exchange, carrying peering advocacy from talks to a community exchange.',
    image: itapSpeaker,
    blocks: [
      {
        type: 'p',
        text: 'The advocacy for stronger local interconnection that began during the *2023 Mindanao and Luzon Telecom Expos* continued to evolve as the Philippine ISP community grew and the demand for more accessible peering became increasingly important.',
      },
      {
        type: 'p',
        text: 'After previously presenting the *“Importance of Connecting to an Internet Exchange”* while serving as a Network Design Engineer at GetaFIX, *Cliff Richard Perez Jr.* continued his involvement in advancing Internet Exchange adoption—this time from a broader industry and community perspective.',
      },
      {
        type: 'figure',
        src: itapSpeaker,
        alt: 'A speaker in a black Maharlika IX hoodie holds a microphone and raises one hand in front of a projected slide',
        caption: 'Presenting Maharlika Internet Exchange at the 2nd ITAP General Assembly in Cebu',
      },
      {
        type: 'p',
        text: 'On *April 25–26, 2025*, during the *2nd ITAP General Assembly in Cebu*, Cliff represented *Maharlika Internet Exchange* as a member of its *Board of Directors and Senior Network Architect*.',
      },
      { type: 'p', text: 'The presentation introduced Maharlika IX to the ISP community and highlighted its core mission:' },
      { type: 'callout', text: '**To provide affordable content and peering access for all Filipinos.**' },
      {
        type: 'p',
        text: 'The session focused on the importance of making Internet Exchange connectivity more accessible to ISPs, particularly operators outside the major metropolitan areas. It emphasized how stronger local interconnection can help reduce dependence on expensive upstream transit, improve routing efficiency, keep more Philippine traffic within the country, and provide better access to content networks.',
      },
      {
        type: 'figure',
        src: itapSmile,
        alt: 'The speaker smiles and gestures while holding a microphone, with a lectern and a projected slide behind him',
        caption: 'During the session on making Internet Exchange access easier for ISPs',
      },
      {
        type: 'p',
        text: 'This marked a significant continuation of the peering advocacy that began years earlier. What initially started as educating ISPs on *why they should connect to an Internet Exchange* had evolved into actively helping build and develop an exchange designed around accessibility, community participation, and regional network growth.',
      },
      {
        type: 'figure',
        src: itapAudience,
        alt: 'A seated attendee speaks into a microphone at a table while the speaker in the black hoodie stands beside him, with ISP members around them',
        caption: 'Discussion with ISP members at the assembly',
      },
      { type: 'p', text: 'The experience also reinforced a principle that would continue to influence the direction of *Techne Consulting*:' },
      {
        type: 'quote',
        text: 'Better Internet infrastructure is not built by bandwidth alone. It is built through stronger interconnection, smarter routing, accessible peering, and cooperation among network operators.',
      },
      {
        type: 'figure',
        src: itapRoom,
        alt: 'A packed conference hall of ISP members watching the speaker, with a slide reading Connect with Us and the Maharlika Internet Exchange logo on two screens',
        caption: 'ISP members at the Maharlika Internet Exchange session',
      },
      {
        type: 'p',
        text: 'From promoting Internet Exchange connectivity in 2023 to helping advance the mission of Maharlika IX in 2025, the journey reflects a consistent commitment to strengthening the Philippine Internet ecosystem and bringing better connectivity closer to ISPs and communities throughout the country.',
      },
    ],
    eventsHeading: '2nd ITAP General Assembly in Cebu on Facebook',
    events: [
      { label: 'First post', href: 'https://www.facebook.com/share/p/14whrVFJ2q5/' },
      { label: 'Second post', href: 'https://www.facebook.com/share/p/1DwqjNim8n/' },
    ],
  },
  {
    slug: 'early-advocacy-for-internet-exchange-connectivity',
    title: 'Early Advocacy for Internet Exchange Connectivity',
    event: 'Mindanao and Luzon Telecom Expos',
    date: 'January 14 and May 5–6, 2023',
    summary:
      'Before Techne Consulting was founded, our CEO and Co-Founder was already presenting to Philippine ISPs on why connecting to an Internet Exchange matters.',
    image: luzonTalk,
    blocks: [
      {
        type: 'p',
        text: 'Techne Consulting’s focus on efficient, resilient, and well-connected ISP networks is rooted in years of practical industry experience and active participation in the Philippine telecommunications community.',
      },
      {
        type: 'p',
        text: 'Before the establishment of Techne Consulting, Cliff Richard Perez Jr., now the company’s CEO and Co-Founder, was already engaged in promoting the importance of peering and Internet Exchange connectivity among local Internet Service Providers.',
      },
      {
        type: 'figure',
        src: luzonTalk,
        alt: 'A speaker at the Luzon Telecom Expo in front of a slide titled Importance of Connecting to an Internet Exchange',
        caption: 'Luzon Telecom Expo, May 5–6, 2023',
      },
      {
        type: 'p',
        text: 'On January 14, 2023, during the Mindanao Telecom Expo, and again on May 5–6, 2023, at the Luzon Telecom Expo, he presented the topic “Importance of Connecting to an Internet Exchange.”',
      },
      {
        type: 'p',
        text: 'At the time, Cliff was serving as a Network Design Engineer for GetaFIX, where he was directly involved in network design, peering, and Internet Exchange operations.',
      },
      { type: 'p', text: 'The presentations focused on the operational and commercial value of Internet Exchange participation, including:' },
      {
        type: 'list',
        items: [
          'Keeping local traffic local',
          'Reducing unnecessary dependency on IP Transit',
          'Improving latency and routing efficiency',
          'Increasing available network capacity',
          'Enhancing end-user experience',
          'Strengthening local interconnection among ISPs and content networks',
        ],
      },
      {
        type: 'p',
        text: 'These engagements marked an early stage in the advocacy that would later become part of Techne Consulting’s broader mission: helping ISPs build networks that are not only connected, but properly engineered for scale, resilience, and efficiency.',
      },
      {
        type: 'figure',
        src: ixDiagramTalk,
        alt: 'A speaker on stage beside a slide that compares ISP paths with an Internet Exchange, showing lower latency',
        caption: 'Mindanao Telecom Expo, January 14, 2023',
      },
      {
        type: 'p',
        text: 'Today, Techne continues to support ISP operators through network consulting, routing and peering strategy, infrastructure modernization, and service provider network design.',
      },
      {
        type: 'p',
        text: 'From early industry education to real-world implementation, Techne remains committed to building stronger and better-connected networks across the Philippines.',
      },
    ],
    eventsHeading: 'The events on Facebook',
    events: [
      { label: 'Luzon Telecom Expo', href: 'https://www.facebook.com/share/p/1CKDvE9DRy/' },
      { label: 'Mindanao Telecom Expo', href: 'https://www.facebook.com/share/p/19t8YMBQDb/' },
    ],
  },
];

export const postBySlug = (slug: string | undefined) => BLOG_POSTS.find((post) => post.slug === slug);
