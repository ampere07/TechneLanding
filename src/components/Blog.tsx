import React from 'react';
import { Link } from 'react-router-dom';
import { PANEL_IDS } from '../constants';

/** The blog has no articles yet, so this page says so and points to the next useful places. */
export const Blog: React.FC = () => (
  <section className="bg-paper-2 border-b border-rule min-h-[60vh] flex items-center">
    <div className="wrap w-full py-16 md:py-24">
      <h1 className="heading-1">Our blog is coming soon</h1>
      <p className="lede mt-4">
        We are preparing articles on networking, infrastructure and enterprise IT from the Techne engineering team. Please check back soon.
      </p>
      <div className="flex flex-wrap gap-3 mt-8">
        <Link to={`/${PANEL_IDS.SERVICES}`} className="btn-primary">View our services</Link>
        <Link to={`/${PANEL_IDS.CONTACT}`} className="btn-secondary">Contact us</Link>
      </div>
    </div>
  </section>
);
