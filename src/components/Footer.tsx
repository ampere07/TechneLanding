import React from 'react';
import { Mail, Phone, MapPin, Share2, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import { PANEL_IDS } from '../constants';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-100 pt-20 pb-10 mt-auto">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div className="flex flex-col">
            <div className="flex items-center space-x-3 mb-6">
              <img src={logo} alt="Techne Consulting Logo" className="h-8 w-auto object-contain" draggable="false" />
              <span className="text-xl font-bold text-slate-900">Techne Consulting</span>
            </div>
            <p className="text-slate-500 mb-6 leading-relaxed text-sm">
              Leading the way in network consulting and internet services. Providing enterprise-grade solutions for businesses in the Philippines and beyond.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/share/1KTi4qrzyZ/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-brand-blue hover:border-brand-blue transition-all shadow-sm">
                <Share2 size={18} />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-slate-900 font-semibold mb-6">Services</h4>
            <ul className="space-y-2">
              <li><Link to={`/${PANEL_IDS.IP_TRANSIT}`} className="text-slate-500 hover:text-brand-blue text-xs transition-colors">IP Transit</Link></li>
              <li><Link to={`/${PANEL_IDS.DIA}`} className="text-slate-500 hover:text-brand-blue text-xs transition-colors">Dedicated Internet (DIA)</Link></li>
              <li><Link to={`/${PANEL_IDS.COLOCATION}`} className="text-slate-500 hover:text-brand-blue text-xs transition-colors">Colocation</Link></li>
              <li><Link to={`/${PANEL_IDS.CORE_CONFIG}`} className="text-slate-500 hover:text-brand-blue text-xs transition-colors">Core Configuration</Link></li>
              <li><Link to={`/${PANEL_IDS.DIST_CONFIG}`} className="text-slate-500 hover:text-brand-blue text-xs transition-colors">Distribution Configuration</Link></li>
              <li><Link to={`/${PANEL_IDS.SYSTEM_INTEGRATION}`} className="text-slate-500 hover:text-brand-blue text-xs transition-colors">System Integration</Link></li>
              <li><Link to={`/${PANEL_IDS.PROTECTIVE_DNS}`} className="text-slate-500 hover:text-brand-blue text-xs transition-colors">Protective DNS Integration</Link></li>
              <li><Link to={`/${PANEL_IDS.NETWORK_CONSULTING}`} className="text-slate-500 hover:text-brand-blue text-xs transition-colors">Network consulting</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-slate-900 font-semibold mb-6">Contact Info</h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-slate-500 text-sm">
                <Mail size={16} className="mt-0.5 text-brand-blue shrink-0" />
                <div className="flex flex-col">
                  <a href="mailto:cliff@technefiber.com" className="hover:text-brand-blue transition-colors">cliff@technefiber.com</a>
                  <a href="mailto:cliff@networkgeekph.com" className="hover:text-brand-blue transition-colors">cliff@networkgeekph.com</a>
                </div>
              </li>
              <li className="flex items-center space-x-3 text-slate-500 text-sm">
                <Phone size={16} className="text-brand-blue shrink-0" />
                <div className="flex flex-col text-xs">
                  <span>+63 968 702 8433 (Office)</span>
                  <span className="flex items-center space-x-1">
                    <MessageSquare size={12} className="text-brand-blue/60" />
                    <span>Viber: +63 968 702 8433</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <MessageSquare size={12} className="text-brand-blue/60" />
                    <span>WeChat: +63 991 348 1898</span>
                  </span>
                </div>
              </li>
              <li className="flex items-start space-x-3 text-slate-500 text-sm">
                <MapPin size={16} className="mt-0.5 text-brand-blue shrink-0" />
                <span>Cebu City, Philippines</span>
              </li>
            </ul>
          </div>

          {/* Executive */}
          <div>
            <h4 className="text-slate-900 font-semibold mb-6">Executive</h4>
            <div className="space-y-2">
              <p className="text-slate-900 font-medium text-sm">Cliff Richard Perez Jr</p>
              <p className="text-brand-blue text-xs uppercase tracking-wider font-bold">CEO</p>
            </div>
            <div className="mt-6 pt-6 border-t border-slate-100">
               <a href="https://www.facebook.com/share/1KTi4qrzyZ/" target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline text-xs font-medium">Visit Facebook Page</a>
            </div>
          </div>
        </div>
        
        <div className="pt-10 border-t border-slate-200 flex flex-col md:row items-center justify-between gap-4">
          <p className="text-slate-400 text-xs">
            © {new Date().getFullYear()} Techne Consulting. All rights reserved.
          </p>
          <div className="flex space-x-6 text-xs text-slate-400">
            <Link to="/999999999" className="hover:text-slate-600">Privacy Policy</Link>
            <Link to="/888888888" className="hover:text-slate-600">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
