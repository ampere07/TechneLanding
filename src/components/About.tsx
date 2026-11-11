import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PANEL_IDS } from '../constants';
import { ClosingCTA } from './ClosingCTA';
import { JourneyTimeline } from './JourneyTimeline';
import { AfterIntro } from './AfterIntro';
import { Reveal } from './Reveal';
import { useJourneyIntro } from './journeyIntro';

/** Where to go next from the About page. */
const NEXT_PAGES = [
  {
    to: `/${PANEL_IDS.NETWORK_BUILDOUT}`,
    eyebrow: 'Our work',
    title: 'Network Buildout',
    desc: 'See completed deployments across the Philippines, with photos from site to handover.',
  },
  {
    to: `/${PANEL_IDS.BLOG}`,
    eyebrow: 'Our updates',
    title: 'Engagement',
    desc: 'News, insights and updates from the Techne team.',
  },
];

const ExploreMore: React.FC = () => (
  <section className="section bg-paper-2 border-t border-rule" aria-labelledby="explore-more-title">
    <div className="wrap">
      <Reveal className="max-w-3xl mb-8">
        <h2 id="explore-more-title" className="heading-2">Explore more</h2>
      </Reveal>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {NEXT_PAGES.map((page, index) => (
          <li key={page.to} className="flex">
            <Reveal className="w-full" delay={index * 0.1} distance={12}>
              <Link
                to={page.to}
                className="group h-full flex flex-col border-t-2 border-ink bg-paper px-6 py-6 hover:border-accent transition-colors duration-150"
              >
                <span className="eyebrow mb-2">{page.eyebrow}</span>
                <span className="heading-3 !text-[1.375rem]">{page.title}</span>
                <span className="body-copy mt-2 flex-1">{page.desc}</span>
                <span className="mt-5 inline-flex items-center gap-1.5 text-[0.9375rem] font-semibold text-accent">
                  Go to {page.title}
                  <ArrowRight size={16} className="transition-transform duration-150 group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </Link>
            </Reveal>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export const About: React.FC = () => {
  const { ready, started } = useJourneyIntro();
  return (
    <>
      <JourneyTimeline ready={ready} started={started} />
      <AfterIntro ready={ready}>
        <ExploreMore />
        <ClosingCTA />
      </AfterIntro>
    </>
  );
};
