import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import { HOME_PATH, PANEL_IDS } from '../constants';
import { CONTACT, SERVICES } from '../content/site';

const linkClass = 'text-[0.9375rem] text-white/75 hover:text-white transition-colors duration-150';

export const Footer: React.FC = () => (
  <footer className="bg-navy text-white">
    <div className="wrap pt-14 pb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.2fr)] gap-10 lg:gap-14 pb-12">
        <div>
          <Link to={HOME_PATH} className="inline-flex items-center gap-2.5">
            <img src={logo} alt="" className="h-9 w-auto object-contain" draggable="false" />
            <span className="font-display text-[1.25rem] font-bold tracking-tight">Techne</span>
          </Link>
          <p className="text-[0.9375rem] leading-relaxed text-white/75 mt-4 max-w-sm">
            Carrier-neutral colocation, IP transit, content access and virtual interconnection for networks in the Philippines.
          </p>
        </div>

        <div>
          <h2 className="text-[0.9375rem] font-semibold mb-4">Services</h2>
          <ul className="space-y-2.5">
            {SERVICES.map((service) => (
              <li key={service.id}>
                <Link to={service.path} className={linkClass}>{service.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-[0.9375rem] font-semibold mb-4">Company</h2>
          <ul className="space-y-2.5">
            <li><Link to={`/${PANEL_IDS.ABOUT}`} className={linkClass}>About Techne</Link></li>
            <li><Link to={`/${PANEL_IDS.PRICING}`} className={linkClass}>Request a quote</Link></li>
            <li><Link to={`/${PANEL_IDS.BLOG}`} className={linkClass}>Engagement</Link></li>
            <li><Link to={`/${PANEL_IDS.NETWORK_BUILDOUT}`} className={linkClass}>Network Buildout</Link></li>
            <li><Link to={`/${PANEL_IDS.FAQ}`} className={linkClass}>FAQ</Link></li>
            <li><Link to={`/${PANEL_IDS.CONTACT}`} className={linkClass}>Contact</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="text-[0.9375rem] font-semibold mb-4">Contact</h2>
          <ul className="space-y-2.5">
            <li><a href={CONTACT.phoneHref} className={linkClass}>{CONTACT.phoneDisplay}</a></li>
            <li><a href={`mailto:${CONTACT.email}`} className={linkClass}>{CONTACT.email}</a></li>
            <li className="text-[0.9375rem] text-white/75">{CONTACT.city}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/15 pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-[0.8125rem] text-white/60">
        <p>© 2023 Techne. All rights reserved.</p>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <Link to="/999999999" className="hover:text-white transition-colors duration-150">Privacy Policy</Link>
          <Link to="/888888888" className="hover:text-white transition-colors duration-150">Terms of Service</Link>
          <a href={CONTACT.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-150">Facebook</a>
        </div>
      </div>
    </div>
  </footer>
);
