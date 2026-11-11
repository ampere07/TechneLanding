import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Check, ExternalLink } from 'lucide-react';
import { HOME_PATH, PANEL_IDS } from '../constants';
import { PARTNERS, partnerBySlug } from '../content/partners';
import { ClosingCTA } from './ClosingCTA';
import { Reveal } from './Reveal';

/** The page for one partner. */
export const PartnerPage: React.FC = () => {
  const { slug } = useParams();
  const partner = partnerBySlug(slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Where this page sits: Home, then About, then the partner.
  const trail = (
    <nav aria-label="Breadcrumb" className="text-[0.8125rem] text-ink-2 flex flex-wrap items-center gap-1.5">
      <Link to={HOME_PATH} className="hover:text-accent transition-colors duration-150">Home</Link>
      <span aria-hidden="true">/</span>
      <Link to={`/${PANEL_IDS.ABOUT}`} className="hover:text-accent transition-colors duration-150">About</Link>
      <span aria-hidden="true">/</span>
      <span className="text-ink" aria-current="page">{partner ? partner.name : 'Partner not found'}</span>
    </nav>
  );

  if (!partner) {
    return (
      <section className="section bg-paper min-h-[60vh]">
        <div className="wrap">
          {trail}
          <h1 className="heading-1 mt-6">Partner not found</h1>
          <p className="lede mt-3">
            We could not find that partner. <Link to={HOME_PATH} className="text-accent font-medium hover:underline">Go to the home page</Link>.
          </p>
        </div>
      </section>
    );
  }

  const others = PARTNERS.filter((item) => item.slug !== partner.slug && item.about);

  return (
    <>
      <section className="section bg-paper-2 border-b border-rule">
        <div className="wrap">
          {trail}
          <Reveal className="mt-8 max-w-4xl mx-auto text-center" distance={12}>
            <p className="eyebrow mb-2">Our partners</p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {partner.src && (
                <span className="inline-flex items-center">
                  <img src={partner.src} alt="" className="h-36 md:h-52 w-auto max-w-full object-contain" draggable={false} />
                </span>
              )}
              <h1 className="heading-1 w-full">{partner.name}</h1>
            </div>
            {partner.summary && <p className="lede mt-4 mx-auto">{partner.summary}</p>}
          </Reveal>
        </div>
      </section>

      <section className="section bg-paper">
        <div className="wrap grid grid-cols-1 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] gap-10 lg:gap-16">
          <Reveal>
            <h2 className="heading-2">About {partner.name}</h2>
            <div className="mt-4 space-y-4 max-w-[68ch]">
              {(partner.about ?? []).map((paragraph, index) => (
                <p key={index} className="body-copy !text-[1rem]">{paragraph}</p>
              ))}
            </div>

            {partner.highlights && partner.highlights.length > 0 && (
              <ul className="mt-6 space-y-2.5">
                {partner.highlights.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <Check size={18} className="text-accent shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="body-copy">{item}</span>
                  </li>
                ))}
              </ul>
            )}

            {partner.website && (
              <a
                href={partner.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-6 text-[0.9375rem] font-medium text-white bg-navy hover:bg-accent rounded-[3px] px-4 py-2.5 transition-colors duration-150"
              >
                Visit {new URL(partner.website).hostname}
                <ExternalLink size={15} aria-hidden="true" />
              </a>
            )}
          </Reveal>

          {others.length > 0 && (
          <Reveal delay={0.1}>
            <h2 className="heading-3 border-b-2 border-ink pb-1.5">Other partners</h2>
            <ul>
              {others.map((item) => (
                <li key={item.slug} className="border-b border-rule">
                  <Link to={`/${PANEL_IDS.PARTNERS}/${item.slug}`} className="group block py-4">
                    <span className="block text-[1rem] font-semibold text-ink group-hover:text-accent transition-colors duration-150">{item.name}</span>
                    <span className="block text-[0.875rem] text-ink-2">{item.type}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
          )}
        </div>
      </section>

      <ClosingCTA reveal />
    </>
  );
};
