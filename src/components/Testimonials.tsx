import React from 'react';
import { Quote } from 'lucide-react';
import { TESTIMONIALS } from '../content/testimonials';
import { Reveal } from './Reveal';

/** Initials for the round badge beside a name. */
const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

/** What clients say about Techne: a quote, who said it, and one measurable result where there is one. */
export const Testimonials: React.FC = () => (
  <section className="bg-paper" aria-labelledby="testimonials-title">
    {/* A short rule, as wide as the page content, rather than edge to edge */}
    <div className="wrap">
      <div className="h-px bg-rule" aria-hidden="true" />
    </div>
    <div className="wrap section">
      <Reveal className="max-w-3xl mb-10">
        <p className="eyebrow mb-2">Client voices</p>
        <h2 id="testimonials-title" className="heading-2">What our clients say</h2>
        <p className="lede mt-3">Networks across the Philippines, in their own words.</p>
      </Reveal>

      <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TESTIMONIALS.map((item, index) => (
          <li key={index} className="flex">
            <Reveal className="w-full" delay={index * 0.1} distance={12}>
              <figure className="h-full flex flex-col border-t-2 border-ink pt-6">
                <Quote size={26} className="text-accent" aria-hidden="true" />
                <blockquote className="mt-4 text-[1.0625rem] leading-relaxed text-ink flex-1">{item.quote}</blockquote>
                {item.result && (
                  <p className="mt-5 inline-flex self-start items-center bg-accent-soft text-accent font-data text-[0.8125rem] font-medium px-2.5 py-1 rounded-[3px]">
                    {item.result}
                  </p>
                )}
                <figcaption className="mt-6 flex items-center gap-3">
                  <span
                    className="w-10 h-10 shrink-0 rounded-full bg-navy text-white font-data text-[0.8125rem] font-semibold flex items-center justify-center"
                    aria-hidden="true"
                  >
                    {initials(item.name)}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[0.9375rem] font-semibold text-ink">{item.name}</span>
                    <span className="block text-[0.8125rem] text-ink-2">
                      {item.role}, {item.company}
                    </span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          </li>
        ))}
      </ul>
    </div>
  </section>
);
