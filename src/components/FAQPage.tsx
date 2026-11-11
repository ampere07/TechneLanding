import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { HOME_PATH, PANEL_IDS } from '../constants';
import { FAQ_GROUPS } from '../content/faq';
import { ClosingCTA } from './ClosingCTA';
import { Reveal } from './Reveal';
import { FAQ } from './ServiceLayout';

/** All the questions, in groups, with a box that narrows them down as the visitor types. */
export const FAQPage: React.FC = () => {
  const [query, setQuery] = useState('');

  const groups = useMemo(() => {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (words.length === 0) return FAQ_GROUPS;
    return FAQ_GROUPS.map((group) => ({
      ...group,
      items: group.items.filter((item) => {
        const text = `${item.q} ${item.a}`.toLowerCase();
        return words.every((word) => text.includes(word));
      }),
    })).filter((group) => group.items.length > 0);
  }, [query]);

  const total = groups.reduce((sum, group) => sum + group.items.length, 0);

  return (
    <>
      <section className="bg-paper-2 border-b border-rule">
        <div className="wrap py-12 lg:py-16">
          <nav aria-label="Breadcrumb" className="text-[0.8125rem] text-ink-2 mb-6 flex items-center gap-1.5">
            <Link to={HOME_PATH} className="hover:text-accent transition-colors duration-150">Home</Link>
            <span aria-hidden="true">/</span>
            <span className="text-ink">FAQ</span>
          </nav>
          <Reveal distance={12} className="max-w-3xl">
            <p className="eyebrow mb-2">Frequently asked questions</p>
            <h1 className="heading-1">Answers before you ask</h1>
            <p className="lede mt-4">Coverage, requirements and how we work. For anything specific to your network, ask our engineers.</p>
          </Reveal>

          <div className="relative mt-8 max-w-xl">
            <label htmlFor="faq-search" className="sr-only">Search the questions</label>
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-3 pointer-events-none" aria-hidden="true" />
            <input
              id="faq-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search the questions"
              className="input-field w-full !pl-10"
              autoComplete="off"
            />
          </div>
        </div>
      </section>

      <section className="section bg-paper" aria-live="polite">
        <div className="wrap">
          {total === 0 ? (
            <div className="max-w-xl">
              <p className="heading-3">No questions match "{query}".</p>
              <p className="body-copy mt-2">
                Try fewer words, or{' '}
                <Link to={`/${PANEL_IDS.CONTACT}`} className="text-accent font-medium hover:underline">ask our engineers directly</Link>.
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {groups.map((group) => (
                <div key={group.title} className="grid grid-cols-1 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] gap-6 lg:gap-14">
                  <h2 className="heading-3 lg:pt-4">{group.title}</h2>
                  <FAQ items={group.items} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <ClosingCTA reveal />
    </>
  );
};
