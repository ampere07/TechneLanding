import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Mail, Menu, Phone, X } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import logo from '../assets/logo.png';
import { PANEL_IDS } from '../constants';
import { CONTACT, SERVICES, SERVICE_GROUPS } from '../content/site';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `text-[0.9375rem] font-medium transition-colors duration-150 ${isActive ? 'text-accent' : 'text-ink hover:text-accent'}`;

export const Header: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setServicesOpen(false);
      setMobileOpen(false);
      setLoginOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const openServices = () => {
    window.clearTimeout(closeTimer.current);
    setServicesOpen(true);
  };

  const closeServicesSoon = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setServicesOpen(false), 140);
  };

  const closeAll = () => {
    setServicesOpen(false);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Utility bar */}
      <div className="hidden md:block bg-navy text-white/80">
        <div className="wrap flex items-center justify-between h-9 text-[0.8125rem]">
          <span>Carrier-neutral network services for ISPs and enterprises in the Philippines</span>
          <div className="flex items-center gap-6">
            <a href={CONTACT.phoneHref} className="inline-flex items-center gap-1.5 hover:text-white transition-colors duration-150">
              <Phone size={13} aria-hidden="true" />
              {CONTACT.phoneDisplay}
            </a>
            <a href={`mailto:${CONTACT.generalEmail}`} className="inline-flex items-center gap-1.5 hover:text-white transition-colors duration-150">
              <Mail size={13} aria-hidden="true" />
              {CONTACT.generalEmail}
            </a>
            <button type="button" onClick={() => setLoginOpen(true)} className="hover:text-white transition-colors duration-150 cursor-pointer">
              Customer login
            </button>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <header className="sticky top-0 z-50 bg-paper border-b border-rule">
        <div className="wrap flex items-center justify-between h-16 lg:h-[72px]">
          <Link to={`/${PANEL_IDS.HOME}`} className="flex items-center gap-2.5 shrink-0" onClick={closeAll}>
            <img src={logo} alt="" className="h-9 w-auto object-contain" draggable="false" />
            <span className="text-[1.25rem] font-bold tracking-tight text-ink">Techne</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8" aria-label="Primary">
            <div onMouseEnter={openServices} onMouseLeave={closeServicesSoon}>
              <button
                type="button"
                aria-expanded={servicesOpen}
                aria-controls="services-menu"
                onClick={() => setServicesOpen((open) => !open)}
                className={`inline-flex items-center gap-1 text-[0.9375rem] font-medium cursor-pointer transition-colors duration-150 ${servicesOpen ? 'text-accent' : 'text-ink hover:text-accent'}`}
              >
                Services
                <ChevronDown size={15} aria-hidden="true" className={`transition-transform duration-150 ${servicesOpen ? 'rotate-180' : ''}`} />
              </button>

              {servicesOpen && (
                <div id="services-menu" className="absolute left-0 right-0 top-full bg-paper border-b border-rule shadow-[0_12px_24px_-16px_rgb(11_37_54_/_0.35)]">
                  <div className="wrap py-8 grid grid-cols-4 gap-10">
                    {SERVICE_GROUPS.map((group) => (
                      <div key={group}>
                        <p className="text-[0.8125rem] font-semibold text-ink-3 pb-2 mb-3 border-b border-rule">{group}</p>
                        <ul className="space-y-4">
                          {SERVICES.filter((service) => service.group === group).map((service) => (
                            <li key={service.id}>
                              <Link to={service.path} onClick={closeAll} className="group block">
                                <span className="block text-[0.9375rem] font-semibold text-ink group-hover:text-accent transition-colors duration-150">
                                  {service.name}
                                </span>
                                <span className="block text-[0.8125rem] text-ink-2 mt-0.5">{service.menuLine}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <div className="bg-paper-2 border-t border-rule">
                    <div className="wrap flex items-center justify-between py-3 text-[0.875rem]">
                      <span className="text-ink-2">Not sure which service you need? Our engineers can help you choose.</span>
                      <Link to={`/${PANEL_IDS.SERVICES}`} onClick={closeAll} className="text-link">
                        View all services
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link to={`/${PANEL_IDS.HOME}#locations`} className="text-[0.9375rem] font-medium text-ink hover:text-accent transition-colors duration-150">
              Locations
            </Link>
            <NavLink to={`/${PANEL_IDS.PRICING}`} className={navLinkClass}>Pricing</NavLink>
            <NavLink to={`/${PANEL_IDS.BLOG}`} className={navLinkClass}>Insights</NavLink>
            <NavLink to={`/${PANEL_IDS.ABOUT}`} className={navLinkClass}>About</NavLink>
          </nav>

          <div className="hidden lg:block">
            <Link to={`/${PANEL_IDS.CONTACT}`} className="btn-primary" onClick={closeAll}>
              Contact us
            </Link>
          </div>

          <button
            type="button"
            className="lg:hidden p-2 -mr-2 text-ink cursor-pointer"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden absolute left-0 right-0 top-full bg-paper border-b border-rule max-h-[calc(100vh-64px)] overflow-y-auto">
            <div className="wrap py-4">
              {SERVICE_GROUPS.map((group) => (
                <div key={group} className="py-3 border-b border-rule">
                  <p className="text-[0.8125rem] font-semibold text-ink-3 mb-1">{group}</p>
                  {SERVICES.filter((service) => service.group === group).map((service) => (
                    <Link key={service.id} to={service.path} onClick={closeAll} className="block py-2 text-[0.9375rem] font-medium text-ink">
                      {service.name}
                    </Link>
                  ))}
                </div>
              ))}
              <Link to={`/${PANEL_IDS.HOME}#locations`} onClick={closeAll} className="block py-3 border-b border-rule font-medium text-ink">Locations</Link>
              <Link to={`/${PANEL_IDS.PRICING}`} onClick={closeAll} className="block py-3 border-b border-rule font-medium text-ink">Pricing</Link>
              <Link to={`/${PANEL_IDS.BLOG}`} onClick={closeAll} className="block py-3 border-b border-rule font-medium text-ink">Insights</Link>
              <Link to={`/${PANEL_IDS.ABOUT}`} onClick={closeAll} className="block py-3 border-b border-rule font-medium text-ink">About</Link>
              <div className="pt-4 flex flex-col gap-3">
                <Link to={`/${PANEL_IDS.CONTACT}`} onClick={closeAll} className="btn-primary w-full">Contact us</Link>
                <button
                  type="button"
                  onClick={() => {
                    closeAll();
                    setLoginOpen(true);
                  }}
                  className="btn-secondary w-full"
                >
                  Customer login
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Login notice */}
      {loginOpen &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="login-title">
            <button type="button" aria-label="Close" onClick={() => setLoginOpen(false)} className="absolute inset-0 bg-navy/50 cursor-pointer" />
            <div className="relative bg-paper rounded-[4px] p-8 max-w-sm w-full">
              <h2 id="login-title" className="heading-3 mb-2">Customer portal coming soon</h2>
              <p className="body-copy mb-6">The customer portal is still being built. For account or support requests, call or email our team.</p>
              <button type="button" onClick={() => setLoginOpen(false)} className="btn-primary w-full">Close</button>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};
