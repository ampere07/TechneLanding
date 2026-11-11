import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HOME_PATH } from '../constants';
import { CLIENT_SITES, REGIONS, SERVICES, type Service } from '../content/clients';
import { PHILIPPINES_PATH } from '../content/worldMap';
import { Pin, VB, toBox, type Framing } from './PhilippinesClients';

const WHOLE_MAP: Framing = { s: 1, x: 0, y: 0 };

/** A page of its own: the whole map with every client pin, and the complete list of clients beside it. */
export const ClientsPage: React.FC = () => {
  const [active, setActive] = useState<number | null>(null);
  const [service, setService] = useState<Service | null>(null);

  // A new page starts at the top.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sites = CLIENT_SITES.filter((site) => !service || site.services.includes(service));

  // Where this page sits: Home, then this page.
  const trail = (
    <nav aria-label="Breadcrumb" className="text-[0.8125rem] text-ink-2 flex flex-wrap items-center gap-1.5">
      <Link to={HOME_PATH} className="hover:text-accent transition-colors duration-150">Home</Link>
      <span aria-hidden="true">/</span>
      <span className="text-ink" aria-current="page">All our clients</span>
    </nav>
  );

  return (
    <section className="section bg-paper-2 min-h-[70vh]" aria-labelledby="all-clients-title">
      <div className="wrap">
        {trail}

        <div className="mt-6 max-w-3xl">
          <p className="eyebrow mb-1">Philippines</p>
          <h1 id="all-clients-title" className="heading-1">All our clients</h1>
          <p className="lede mt-3">Every client area across Luzon, Visayas and Mindanao, on the map and in the list.</p>

          <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Filter by service">
            {([null, ...SERVICES] as (Service | null)[]).map((option) => (
              <button
                key={option ?? 'all'}
                type="button"
                aria-pressed={service === option}
                onClick={() => {
                  setActive(null);
                  setService(option);
                }}
                className={`text-[0.8125rem] font-medium rounded-[3px] border px-3 py-1.5 cursor-pointer transition-colors duration-150 ${service === option ? 'bg-navy border-navy text-white' : 'border-rule text-ink-2 hover:border-accent hover:text-accent'}`}
              >
                {option ?? 'All'}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] gap-10 lg:gap-16 items-start">
          {/* Map with every pin. It stays in view while the list scrolls. */}
          <div className="md:sticky md:top-28 w-full max-w-[460px] justify-self-center md:justify-self-start">
            <div className="relative" style={{ aspectRatio: `${VB.w} / ${VB.h}` }} onPointerLeave={() => setActive(null)}>
              <svg viewBox={`${VB.x} ${VB.y} ${VB.w} ${VB.h}`} className="absolute inset-0 w-full h-full" role="img" aria-label="Map of the Philippines with a pin for each client area">
                <path d={PHILIPPINES_PATH} fill="#2a8f93" stroke="#ffffff" strokeWidth="1" vectorEffect="non-scaling-stroke" />
              </svg>
              {sites.map((site, i) => {
                const at = toBox(site.lon, site.lat);
                return (
                  <Pin
                    key={site.name}
                    n={i}
                    delay={0.2 + i * 0.05}
                    left={at.left}
                    top={at.top}
                    view={WHOLE_MAP}
                    still
                    open={active === i}
                    name={site.name}
                    detail={site.services.join(' · ')}
                    onActive={(on) => setActive(on ? i : null)}
                    onToggle={() => setActive(active === i ? null : i)}
                  />
                );
              })}
            </div>
          </div>

          {/* The full list, grouped by island group */}
          <div className="space-y-8">
            {REGIONS.map((name) => {
              const rows = sites.map((site, index) => ({ site, index })).filter(({ site }) => site.region === name);
              if (rows.length === 0) return null;
              return (
                <motion.div key={name} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                  <h2 className="text-[0.9375rem] font-semibold text-ink border-b-2 border-ink pb-1.5">{name}</h2>
                  <ul>
                    {rows.map(({ site, index }) => (
                      <li
                        key={site.name}
                        onPointerEnter={() => setActive(index)}
                        onPointerLeave={() => setActive(null)}
                        className={`flex items-center gap-3 py-2.5 border-b border-rule transition-colors duration-150 ${active === index ? 'bg-accent-soft' : ''}`}
                      >
                        <span className={`font-data w-6 h-6 shrink-0 rounded-full text-[0.6875rem] font-semibold flex items-center justify-center transition-colors duration-150 ${active === index ? 'bg-accent text-white' : 'bg-navy text-white'}`}>
                          {index + 1}
                        </span>
                        <span className="flex-1 min-w-0 text-[0.9375rem] font-medium text-ink truncate">{site.name}</span>
                        <span className="flex flex-wrap justify-end gap-1.5">
                          {site.services.map((sv) => (
                            <span key={sv} className="text-[0.75rem] text-ink-3 border border-rule rounded-[2px] px-1.5 py-0.5">{sv}</span>
                          ))}
                        </span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
            {sites.length === 0 && <p className="body-copy">No clients match this filter.</p>}
          </div>
        </div>

      </div>
    </section>
  );
};
