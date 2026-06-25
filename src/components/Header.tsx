import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Menu, X, ChevronRight, ChevronDown } from 'lucide-react';
import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/logo.png';
import { PANEL_IDS } from '../constants';

export const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isServicesHovered, setIsServicesHovered] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const servicesDropdown = {
    internet: [
      { name: 'IP Transit', path: `/${PANEL_IDS.IP_TRANSIT}` },
      { name: 'DIA', path: `/${PANEL_IDS.DIA}` },
      { name: 'Colocation', path: `/${PANEL_IDS.COLOCATION}` },
    ],
    managed: [
      { name: 'Core Configuration', path: `/${PANEL_IDS.CORE_CONFIG}` },
      { name: 'Distribution Configuration', path: `/${PANEL_IDS.DIST_CONFIG}` },
      { name: 'System Integration', path: `/${PANEL_IDS.SYSTEM_INTEGRATION}` },
      { name: 'Protective DNS Integration', path: `/${PANEL_IDS.PROTECTIVE_DNS}` },
      { name: 'Network Consulting', path: `/${PANEL_IDS.NETWORK_CONSULTING}` },
    ]
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative font-display text-sm font-medium transition-colors duration-[180ms] after:absolute after:-bottom-1.5 after:left-0 after:h-px after:bg-accent after:transition-all after:duration-200 ${
      isActive ? 'text-ink after:w-full' : 'text-ink-2 hover:text-ink after:w-0 hover:after:w-full'
    }`;

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-paper border-b border-rule">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">

        <Link
          to={`/${PANEL_IDS.HOME}`}
          className="flex items-center gap-2.5"
          onClick={() => setIsOpen(false)}
        >
          <img src={logo} alt="Techne" className="h-9 w-auto object-contain" draggable="false" />
          <span className="font-display font-bold text-[1.125rem] tracking-tight text-ink">
            Tec<span className="text-accent">hne</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          <NavLink to={`/${PANEL_IDS.HOME}`} className={navLinkClass}>Home</NavLink>

          <div
            className="relative"
            onMouseEnter={() => setIsServicesHovered(true)}
            onMouseLeave={() => setIsServicesHovered(false)}
          >
            <button
              className={`font-display text-sm font-medium transition-colors duration-[180ms] flex items-center gap-1 ${isServicesHovered ? 'text-ink' : 'text-ink-2 hover:text-ink'}`}
            >
              Services
              <ChevronDown
                size={13}
                className={`transition-transform duration-[180ms] ${isServicesHovered ? 'rotate-180' : ''}`}
              />
            </button>

            <AnimatePresence>
              {isServicesHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[460px] bg-paper border border-rule rounded-[4px] shadow-sm grid grid-cols-2 divide-x divide-rule"
                >
                  <div className="p-5">
                    <p className="font-mono text-[10px] text-ink-2 uppercase tracking-widest mb-3">Internet</p>
                    <ul className="space-y-2">
                      {servicesDropdown.internet.map(item => (
                        <li key={item.name}>
                          <Link
                            to={item.path}
                            className="font-display text-sm font-medium text-ink-2 hover:text-accent transition-colors duration-[180ms] block"
                          >
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-5">
                    <p className="font-mono text-[10px] text-ink-2 uppercase tracking-widest mb-3">Managed Services</p>
                    <ul className="space-y-2">
                      {servicesDropdown.managed.map(item => (
                        <li key={item.name}>
                          <Link
                            to={item.path}
                            className="font-display text-sm font-medium text-ink-2 hover:text-accent transition-colors duration-[180ms] block leading-snug"
                          >
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <NavLink to={`/${PANEL_IDS.PRICING}`} className={navLinkClass}>Pricing</NavLink>
          <NavLink to={`/${PANEL_IDS.BLOG}`} className={navLinkClass}>Blog</NavLink>
          <NavLink to={`/${PANEL_IDS.ABOUT}`} className={navLinkClass}>About</NavLink>

          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="font-display text-sm font-medium text-ink-2 hover:text-ink transition-colors duration-[180ms]"
          >
            Login
          </button>

          <Link
            to={`/${PANEL_IDS.CONTACT}`}
            className="btn-primary"
          >
            Inquire
            <ChevronRight size={14} />
          </Link>
        </nav>

        <button
          className="md:hidden text-ink-2 hover:text-ink transition-colors p-1"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden absolute top-full left-0 w-full bg-paper border-b border-rule overflow-y-auto max-h-[80vh]"
          >
            <div className="container mx-auto px-6 py-4 flex flex-col">
              <Link
                to={`/${PANEL_IDS.HOME}`}
                className="font-display font-medium text-ink py-3 border-b border-rule"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>

              <div className="py-3 border-b border-rule space-y-2">
                <p className="font-mono text-[10px] text-ink-2 uppercase tracking-widest mb-2">Internet</p>
                {servicesDropdown.internet.map(item => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="font-display text-sm font-medium text-ink-2 block pl-3 py-1"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <p className="font-mono text-[10px] text-ink-2 uppercase tracking-widest mt-3 mb-2">Managed Services</p>
                {servicesDropdown.managed.map(item => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="font-display text-sm font-medium text-ink-2 block pl-3 py-1"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              <Link to={`/${PANEL_IDS.PRICING}`} className="font-display font-medium text-ink py-3 border-b border-rule" onClick={() => setIsOpen(false)}>Pricing</Link>
              <Link to={`/${PANEL_IDS.BLOG}`} className="font-display font-medium text-ink py-3 border-b border-rule" onClick={() => setIsOpen(false)}>Blog</Link>
              <Link to={`/${PANEL_IDS.ABOUT}`} className="font-display font-medium text-ink py-3 border-b border-rule" onClick={() => setIsOpen(false)}>About</Link>

              <div className="pt-4 flex flex-col gap-3">
                <button
                  onClick={() => { setIsOpen(false); setIsLoginModalOpen(true); }}
                  className="w-full py-2.5 border border-rule text-ink font-display font-semibold text-sm rounded-[4px] text-center transition-colors hover:bg-paper-2"
                >
                  Login
                </button>
                <Link
                  to={`/${PANEL_IDS.CONTACT}`}
                  className="btn-primary w-full justify-center"
                  onClick={() => setIsOpen(false)}
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login modal */}
      {createPortal(
        <AnimatePresence>
          {isLoginModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                onClick={() => setIsLoginModalOpen(false)}
                className="absolute inset-0 bg-ink/40 backdrop-blur-sm cursor-pointer"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.97, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: 16 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="relative bg-paper border border-rule rounded-[4px] p-8 max-w-sm w-full text-center z-10 shadow-sm"
              >
                <h3 className="font-display text-lg font-bold text-ink mb-2">Under Construction</h3>
                <p className="font-body text-sm text-ink-2 mb-8 leading-relaxed">
                  The customer portal is currently being built. Please check back later.
                </p>
                <button
                  onClick={() => setIsLoginModalOpen(false)}
                  className="btn-primary w-full justify-center py-3"
                >
                  Got it
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </header>
  );
};
