import React from 'react';
import { Link } from 'react-router-dom';
import { PANEL_IDS } from '../constants';
import { serviceQuoteLink } from '../content/quote';
import { CONTACT } from '../content/site';

const primaryClass =
  'inline-flex items-center justify-center px-5 py-3 bg-white text-accent-hover text-[0.9375rem] font-semibold rounded-[3px] hover:bg-paper-3 transition-colors duration-150 whitespace-nowrap';

/** The call to action that closes every page. Service pages pass their name to request a quote directly. */
export const ClosingCTA: React.FC<{ service?: string }> = ({ service }) => (
  <section className="bg-accent text-white">
    <div className="wrap py-12 md:py-14 grid grid-cols-1 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] gap-8 items-center">
      <div>
        <h2 className="heading-2 !text-white">Tell us what you need to connect</h2>
        <p className="text-[1rem] text-white/85 mt-3 max-w-xl">
          Share your location, capacity and timeline, and an engineer will come back to you within 24 hours. You can also call {CONTACT.phoneDisplay}.
        </p>
      </div>
      <div className="flex flex-wrap gap-3 md:justify-end">
        {service ? (
          <Link to={serviceQuoteLink(service)} className={primaryClass}>Request a quote</Link>
        ) : (
          <>
            <Link to={`/${PANEL_IDS.CONTACT}`} className={primaryClass}>Contact us</Link>
            <Link to={`/${PANEL_IDS.PRICING}`} className="btn-outline-on-navy">Request a quote</Link>
          </>
        )}
      </div>
    </div>
  </section>
);
