import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { HOME_PATH } from '../constants';
import { AVERAGE_RATING, TESTIMONIALS } from '../content/testimonials';
import { ClosingCTA } from './ClosingCTA';
import { Reveal } from './Reveal';
import { TestimonialCard } from './Testimonials';

/** Every testimonial, in full. */
export const TestimonialsPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <section className="section bg-paper-2 border-b border-rule">
        <div className="wrap">
          <nav aria-label="Breadcrumb" className="text-[0.8125rem] text-ink-2 flex flex-wrap items-center gap-1.5">
            <Link to={HOME_PATH} className="hover:text-accent transition-colors duration-150">Home</Link>
            <span aria-hidden="true">/</span>
            <span className="text-ink" aria-current="page">Testimonials</span>
          </nav>
          <Reveal className="mt-6 max-w-3xl" distance={12}>
            <h1 className="heading-1">What our clients say</h1>
            <p className="lede mt-3">Networks across the Philippines, in their own words.</p>
            <p className="mt-5 inline-flex items-center gap-2 text-[0.9375rem] text-ink-2">
              <Star size={18} className="text-[#e8a317] fill-[#e8a317]" aria-hidden="true" />
              <span>
                <strong className="text-ink">{AVERAGE_RATING.toFixed(1)}</strong> out of 5, from {TESTIMONIALS.length} client reviews
              </span>
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section bg-paper">
        <div className="wrap">
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
            {TESTIMONIALS.map((item, index) => (
              <li key={`${item.firstName}-${item.company}`} className="flex">
                <Reveal className="w-full" delay={(index % 3) * 0.08} distance={12}>
                  <TestimonialCard item={item} clamp={false} />
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ClosingCTA reveal />
    </>
  );
};
