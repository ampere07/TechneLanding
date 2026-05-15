import React, { useState } from 'react';
import { Menu, X, ChevronRight, ChevronDown } from 'lucide-react';
import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/logo.png';
import { PANEL_IDS } from '../constants';

export const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isServicesHovered, setIsServicesHovered] = useState(false);

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
      { name: 'Network consulting', path: `/${PANEL_IDS.NETWORK_CONSULTING}` },
    ]
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 glass border-b border-slate-100">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link to={`/${PANEL_IDS.HOME}`} className="flex items-center space-x-3" onClick={() => setIsOpen(false)}>
          <img src={logo} alt="Techne Consulting Logo" className="h-10 w-auto object-contain" draggable="false" />
          <span className="text-xl font-bold tracking-tight text-slate-900">Techne<span className="text-brand-blue">Consulting</span></span>
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <NavLink to={`/${PANEL_IDS.HOME}`} className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-brand-blue' : 'text-slate-600 hover:text-brand-blue'}`}>Home</NavLink>

          {/* Services Dropdown */}
          <div
            className="relative h-20 flex items-center"
            onMouseEnter={() => setIsServicesHovered(true)}
            onMouseLeave={() => setIsServicesHovered(false)}
          >
            <button className={`text-sm font-medium transition-colors flex items-center space-x-1 ${isServicesHovered ? 'text-brand-blue' : 'text-slate-600 hover:text-brand-blue'}`}>
              <span>Services</span>
              <ChevronDown size={14} className={`transition-transform duration-300 ${isServicesHovered ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isServicesHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-20 left-1/2 -translate-x-1/2 w-[450px] bg-white border border-slate-100 shadow-2xl rounded-2xl p-6 grid grid-cols-2 gap-8"
                >
                  <div>
                    <h4 className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-4">Internet</h4>
                    <ul className="space-y-3">
                      {servicesDropdown.internet.map(item => (
                        <li key={item.name}>
                          <Link to={item.path} className="text-sm font-medium text-slate-600 hover:text-brand-blue transition-colors block">
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-4">Managed Services</h4>
                    <ul className="space-y-3">
                      {servicesDropdown.managed.map(item => (
                        <li key={item.name}>
                          <Link to={item.path} className="text-sm font-medium text-slate-600 hover:text-brand-blue transition-colors block leading-tight">
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

          <NavLink to={`/${PANEL_IDS.BLOG}`} className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-brand-blue' : 'text-slate-600 hover:text-brand-blue'}`}>Blog</NavLink>
          <NavLink to={`/${PANEL_IDS.ABOUT}`} className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-brand-blue' : 'text-slate-600 hover:text-brand-blue'}`}>About</NavLink>

          <NavLink to={`/${PANEL_IDS.CONTACT}`} className="btn-primary flex items-center space-x-2 py-2 px-5">
            <span>Inquire Now</span>
            <ChevronRight size={16} />
          </NavLink>
        </nav>

        <button className="md:hidden text-slate-600" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-slate-100 p-6 flex flex-col space-y-4 animate-in slide-in-from-top duration-300 shadow-xl overflow-y-auto max-h-[80vh]">
          <Link to={`/${PANEL_IDS.HOME}`} className="text-lg font-medium text-slate-600" onClick={() => setIsOpen(false)}>Home</Link>

          <div className="space-y-3">
            <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Internet</span>
            {servicesDropdown.internet.map(item => (
              <Link key={item.name} to={item.path} className="text-lg font-medium text-slate-600 block pl-4" onClick={() => setIsOpen(false)}>{item.name}</Link>
            ))}
            <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400 pt-2 block">Managed Services</span>
            {servicesDropdown.managed.map(item => (
              <Link key={item.name} to={item.path} className="text-lg font-medium text-slate-600 block pl-4" onClick={() => setIsOpen(false)}>{item.name}</Link>
            ))}
          </div>

          <Link to={`/${PANEL_IDS.BLOG}`} className="text-lg font-medium text-slate-600" onClick={() => setIsOpen(false)}>Blog</Link>
          <Link to={`/${PANEL_IDS.ABOUT}`} className="text-lg font-medium text-slate-600" onClick={() => setIsOpen(false)}>About</Link>
          <Link to={`/${PANEL_IDS.CONTACT}`} className="btn-primary text-center" onClick={() => setIsOpen(false)}>Contact Us</Link>
        </div>
      )}
    </header>
  );
};
