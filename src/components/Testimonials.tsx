import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Quote, Star } from 'lucide-react';
import { PANEL_IDS } from '../constants';
import { TESTIMONIALS, topTestimonials, type Testimonial } from '../content/testimonials';
import { Reveal } from './Reveal';

/** Only the first name is shown. The rest of the name is hidden behind asterisks. */
const shownName = (item: Testimonial) => `${item.firstName} ****`;

/** Quotes longer than this are cut short on a card, with a "Read more" button. */
const LONG_QUOTE = 260;

const Stars: React.FC<{ rating: number }> = ({ rating }) => (
  <span className="inline-flex items-center gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((n) => (
      <Star key={n} size={16} aria-hidden="true" className={n <= rating ? 'text-[#e8a317] fill-[#e8a317]' : 'text-rule-strong'} />
    ))}
  </span>
);

/** One testimonial: the rating, the quote, the services the client uses, and who said it. */
export const TestimonialCard: React.FC<{ item: Testimonial; clamp?: boolean }> = ({ item, clamp = true }) => {
  const [open, setOpen] = useState(false);
  const text = item.quote.join(' ');
  const long = clamp && text.length > LONG_QUOTE;
  const cut = long && !open;
  return (
    <figure className="h-full flex flex-col border-t-2 border-ink pt-6">
      <div className="flex items-center justify-between">
        <Quote size={26} className="text-accent" aria-hidden="true" />
        <Stars rating={item.rating} />
      </div>
      <blockquote className="mt-4 flex-1 space-y-3 text-[1rem] leading-relaxed text-ink">
        {cut ? (
          <p className="line-clamp-6">{text}</p>
        ) : (
          item.quote.map((paragraph, index) => <p key={index}>{paragraph}</p>)
        )}
        {long && (
          <button
            type="button"
            onClick={() => setOpen((on) => !on)}
            aria-expanded={open}
            className="text-[0.875rem] font-semibold text-accent hover:underline cursor-pointer"
          >
            {open ? 'Show less' : 'Read more'}
          </button>
        )}
      </blockquote>
      {item.services.length > 0 && (
        <div className="mt-5">
          <p className="text-[0.75rem] font-medium uppercase tracking-wider text-ink-3">Current services</p>
          <ul className="mt-2 flex flex-wrap gap-1.5" aria-label="Current services">
            {item.services.map((service) => (
              <li key={service} className="bg-accent-soft text-accent font-data text-[0.75rem] font-medium px-2 py-0.5 rounded-[3px]">
                {service}
              </li>
            ))}
          </ul>
        </div>
      )}
      <figcaption className="mt-5 flex items-center gap-3">
        <span
          className="w-10 h-10 shrink-0 rounded-full bg-navy text-white font-data text-[0.8125rem] font-semibold flex items-center justify-center"
          aria-hidden="true"
        >
          {item.firstName[0]?.toUpperCase()}
        </span>
        <span className="min-w-0">
          <span className="block text-[0.9375rem] font-semibold text-ink">{shownName(item)}</span>
          <span className="block text-[0.8125rem] text-ink-2">{item.company}</span>
        </span>
      </figcaption>
    </figure>
  );
};

/** The best-rated testimonials on the home page, with a link to all of them. */
export const Testimonials: React.FC = () => {
  const top = topTestimonials();
  return (
    <section className="bg-paper" aria-labelledby="testimonials-title">
      {/* A short rule, as wide as the page content, rather than edge to edge */}
      <div className="wrap">
        <div className="h-px bg-rule" aria-hidden="true" />
      </div>
      <div className="wrap section">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
          <Reveal className="max-w-3xl">
            <h2 id="testimonials-title" className="heading-2">What our clients say</h2>
            <p className="lede mt-3">Networks across the Philippines, in their own words.</p>
          </Reveal>
          <Reveal delay={0.1}>
            <Link
              to={`/${PANEL_IDS.TESTIMONIALS}`}
              className="group inline-flex items-center gap-2 text-[0.9375rem] font-semibold text-accent hover:text-accent-hover whitespace-nowrap transition-colors duration-150"
            >
              View all {TESTIMONIALS.length} testimonials
              <ArrowRight size={16} className="transition-transform duration-150 group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {top.map((item, index) => (
            <li key={`${item.firstName}-${item.company}`} className="flex">
              <Reveal className="w-full" delay={index * 0.1} distance={12}>
                <TestimonialCard item={item} />
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
