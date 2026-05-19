import React from 'react';
import { Mail, Phone, MapPin, Share2, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import { PANEL_IDS } from '../constants';

import amazonLogo from '../assets/CDNS/Amazon_logo.svg.webp';
import logo1 from '../assets/CDNS/Logo (1).png';
import metaLogo from '../assets/CDNS/Meta_Platforms_Inc._logo.svg.png';
import netskopeLogo from '../assets/CDNS/Netskope_logo_logotype.png';
import operaLogo from '../assets/CDNS/Opera_Software_logo.png';
import riotLogo from '../assets/CDNS/Riot_Games_2022.svg';
import steamLogo from '../assets/CDNS/Steam_logo.svg';
import tencentLogo from '../assets/CDNS/Tencent_Logo.svg.png';
import twitchLogo from '../assets/CDNS/Twitch_logo_2019.svg.png';
import alibabaLogo from '../assets/CDNS/alibaba-brand-color.png';

const cdnLogos = [
  { src: tencentLogo, alt: 'Tencent', className: 'h-6 object-contain brightness-0 invert opacity-50 hover:opacity-100 hover:scale-105 transition-all duration-300' },
  { src: twitchLogo, alt: 'Twitch', className: 'h-6 object-contain grayscale invert contrast-200 opacity-50 hover:opacity-100 hover:scale-105 transition-all duration-300 mix-blend-screen' },
  { src: steamLogo, alt: 'Steam', className: 'h-6 object-contain brightness-0 invert opacity-50 hover:opacity-100 hover:scale-105 transition-all duration-300' },
  { src: riotLogo, alt: 'Riot Games', className: 'h-6 object-contain brightness-0 invert opacity-50 hover:opacity-100 hover:scale-105 transition-all duration-300' },
  { src: operaLogo, alt: 'Opera', className: 'h-6 object-contain brightness-0 invert opacity-50 hover:opacity-100 hover:scale-105 transition-all duration-300' },
  { src: netskopeLogo, alt: 'Netskope', className: 'h-6 object-contain brightness-0 invert opacity-50 hover:opacity-100 hover:scale-105 transition-all duration-300' },
  { src: alibabaLogo, alt: 'Alibaba', className: 'h-6 object-contain brightness-0 invert opacity-50 hover:opacity-100 hover:scale-105 transition-all duration-300' },
  { src: amazonLogo, alt: 'Amazon', className: 'h-6 object-contain brightness-0 invert opacity-50 hover:opacity-100 hover:scale-105 transition-all duration-300' },
  { src: metaLogo, alt: 'Meta', className: 'h-6 object-contain brightness-0 invert opacity-50 hover:opacity-100 hover:scale-105 transition-all duration-300' },
  { src: logo1, alt: 'CDN Partner', className: 'h-6 object-contain brightness-0 invert opacity-50 hover:opacity-100 hover:scale-105 transition-all duration-300' },
];

export const Footer: React.FC = () => {
  return (
    <>
      <div className="bg-[#0f172a] py-6 border-y border-slate-800 w-full overflow-hidden mt-auto">
        <div className="container mx-auto px-6">
          <p className="text-[10px] text-white font-bold tracking-widest text-center mb-5 uppercase">
            Directly connected to leading CDNs & Networks
          </p>
          <div className="relative flex overflow-hidden group">
            <div className="flex animate-marquee space-x-12 shrink-0 pr-12 group-hover:[animation-play-state:paused]">
              {cdnLogos.map((logo, index) => (
                <img key={index} src={logo.src} alt={logo.alt} className={logo.className} draggable="false" />
              ))}
            </div>
            <div className="flex animate-marquee space-x-12 shrink-0 pr-12 group-hover:[animation-play-state:paused]">
              {cdnLogos.map((logo, index) => (
                <img key={`dup-${index}`} src={logo.src} alt={logo.alt} className={logo.className} draggable="false" />
              ))}
            </div>
          </div>
        </div>
      </div>
      <footer className="bg-white border-t border-slate-100 pt-20 pb-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
            {/* Brand Info */}
            <div className="flex flex-col">
              <div className="flex items-center space-x-3 mb-6">
                <img src={logo} alt="Techne Consulting Logo" className="h-8 w-auto object-contain" draggable="false" />
                <span className="text-xl font-bold tracking-tight text-brand-blue">Tec<span className="text-slate-900">hne</span></span>
              </div>
              <p className="text-slate-500 mb-6 leading-relaxed text-sm">
                Leading the way in network consulting and internet services. Providing enterprise-grade solutions for businesses in the Philippines and beyond.
              </p>
              <div className="flex space-x-4">
                <a href="https://www.facebook.com/techne.consulting" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-brand-blue hover:border-brand-blue transition-all shadow-sm">
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
                    <a href="mailto:info@technefiber.com" className="hover:text-brand-blue transition-colors">info@technefiber.com</a>
                  </div>
                </li>
                <li className="flex items-center space-x-3 text-slate-500 text-sm">
                  <Phone size={16} className="text-brand-blue shrink-0" />
                  <div className="flex flex-col text-xs">
                    <span className="flex items-center space-x-1">
                      <MessageSquare size={12} className="text-brand-blue/60" />
                      <span>Office: +63 968 702 8433</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <MessageSquare size={12} className="text-brand-blue/60" />
                      <span>Viber: +63 968 702 8433</span>
                    </span>
                  </div>
                </li>
                <li className="flex items-start space-x-3 text-slate-500 text-sm">
                  <MapPin size={16} className="mt-0.5 text-brand-blue shrink-0" />
                  <span>Cebu City, Philippines</span>
                </li>
              </ul>
              <div className="mt-6 pt-6 border-t border-slate-100">
                <a href="https://www.facebook.com/techne.consulting" target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline text-xs font-medium">Visit Facebook Page</a>
              </div>
            </div>
          </div>

          <div className="pt-10 border-t border-slate-200 flex flex-col md:row items-center justify-between gap-4">
            <p className="text-slate-400 text-xs">
              © {new Date().getFullYear()} Techne. All rights reserved.
            </p>
            <div className="flex space-x-6 text-xs text-slate-400">
              <Link to="/999999999" className="hover:text-slate-600">Privacy Policy</Link>
              <Link to="/888888888" className="hover:text-slate-600">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};
