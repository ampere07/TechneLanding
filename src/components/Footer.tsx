import React from 'react';
import { Mail, Phone, MapPin, MessageSquare } from 'lucide-react';
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
  { src: tencentLogo, alt: 'Tencent', className: 'h-5 object-contain brightness-0 invert opacity-40 hover:opacity-70 transition-opacity duration-[180ms]' },
  { src: twitchLogo, alt: 'Twitch', className: 'h-5 object-contain grayscale invert contrast-200 opacity-40 hover:opacity-70 transition-opacity duration-[180ms] mix-blend-screen' },
  { src: steamLogo, alt: 'Steam', className: 'h-5 object-contain brightness-0 invert opacity-40 hover:opacity-70 transition-opacity duration-[180ms]' },
  { src: riotLogo, alt: 'Riot Games', className: 'h-5 object-contain brightness-0 invert opacity-40 hover:opacity-70 transition-opacity duration-[180ms]' },
  { src: operaLogo, alt: 'Opera', className: 'h-5 object-contain brightness-0 invert opacity-40 hover:opacity-70 transition-opacity duration-[180ms]' },
  { src: netskopeLogo, alt: 'Netskope', className: 'h-5 object-contain brightness-0 invert opacity-40 hover:opacity-70 transition-opacity duration-[180ms]' },
  { src: alibabaLogo, alt: 'Alibaba', className: 'h-5 object-contain brightness-0 invert opacity-40 hover:opacity-70 transition-opacity duration-[180ms]' },
  { src: amazonLogo, alt: 'Amazon', className: 'h-5 object-contain brightness-0 invert opacity-40 hover:opacity-70 transition-opacity duration-[180ms]' },
  { src: metaLogo, alt: 'Meta', className: 'h-5 object-contain brightness-0 invert opacity-40 hover:opacity-70 transition-opacity duration-[180ms]' },
  { src: logo1, alt: 'CDN Partner', className: 'h-5 object-contain brightness-0 invert opacity-40 hover:opacity-70 transition-opacity duration-[180ms]' },
];

export const Footer: React.FC = () => {
  return (
    <>
      {/* CDN marquee strip */}
      <div className="bg-ink py-5 border-y border-white/5 w-full overflow-hidden">
        <div className="container mx-auto px-6 mb-4">
          <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest text-center">
            Directly connected to leading CDNs &amp; Networks
          </p>
        </div>
        <div className="relative flex overflow-hidden group">
          <div className="flex animate-marquee gap-10 shrink-0 pr-10 group-hover:[animation-play-state:paused]">
            {cdnLogos.map((logo, index) => (
              <img key={index} src={logo.src} alt={logo.alt} className={logo.className} draggable="false" />
            ))}
          </div>
          <div className="flex animate-marquee gap-10 shrink-0 pr-10 group-hover:[animation-play-state:paused]">
            {cdnLogos.map((logo, index) => (
              <img key={`dup-${index}`} src={logo.src} alt={logo.alt} className={logo.className} draggable="false" />
            ))}
          </div>
        </div>
      </div>

      {/* Footer body */}
      <footer className="bg-ink text-white">
        <div className="container mx-auto px-6 pt-16 pb-10 max-w-7xl">

          {/* Statement */}
          <div className="border-b border-white/10 pb-12 mb-12">
            <div className="flex items-center gap-3 mb-6">
              <img src={logo} alt="Techne" className="h-8 w-auto object-contain brightness-0 invert opacity-80" draggable="false" />
              <span className="font-display font-bold text-xl tracking-tight text-white">
                Techne
              </span>
            </div>
            <p
              className="font-display font-semibold text-white/70 leading-tight tracking-tight max-w-2xl"
              style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)' }}
            >
              Carrier-neutral network infrastructure for the Philippines.
            </p>
          </div>

          {/* Links grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-14">
            <div>
              <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-4">Services</p>
              <ul className="space-y-2">
                <li><Link to={`/${PANEL_IDS.IP_TRANSIT}`} className="font-body text-sm text-white/50 hover:text-white transition-colors duration-[180ms]">IP Transit</Link></li>
                <li><Link to={`/${PANEL_IDS.DIA}`} className="font-body text-sm text-white/50 hover:text-white transition-colors duration-[180ms]">Dedicated Internet (DIA)</Link></li>
                <li><Link to={`/${PANEL_IDS.COLOCATION}`} className="font-body text-sm text-white/50 hover:text-white transition-colors duration-[180ms]">Colocation</Link></li>
                <li><Link to={`/${PANEL_IDS.CORE_CONFIG}`} className="font-body text-sm text-white/50 hover:text-white transition-colors duration-[180ms]">Core Configuration</Link></li>
                <li><Link to={`/${PANEL_IDS.DIST_CONFIG}`} className="font-body text-sm text-white/50 hover:text-white transition-colors duration-[180ms]">Distribution Configuration</Link></li>
                <li><Link to={`/${PANEL_IDS.SYSTEM_INTEGRATION}`} className="font-body text-sm text-white/50 hover:text-white transition-colors duration-[180ms]">System Integration</Link></li>
                <li><Link to={`/${PANEL_IDS.PROTECTIVE_DNS}`} className="font-body text-sm text-white/50 hover:text-white transition-colors duration-[180ms]">Protective DNS</Link></li>
                <li><Link to={`/${PANEL_IDS.NETWORK_CONSULTING}`} className="font-body text-sm text-white/50 hover:text-white transition-colors duration-[180ms]">Network Consulting</Link></li>
              </ul>
            </div>

            <div>
              <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-4">Company</p>
              <ul className="space-y-2">
                <li><Link to={`/${PANEL_IDS.ABOUT}`} className="font-body text-sm text-white/50 hover:text-white transition-colors duration-[180ms]">About</Link></li>
                <li><Link to={`/${PANEL_IDS.BLOG}`} className="font-body text-sm text-white/50 hover:text-white transition-colors duration-[180ms]">Blog</Link></li>
                <li><Link to={`/${PANEL_IDS.PRICING}`} className="font-body text-sm text-white/50 hover:text-white transition-colors duration-[180ms]">Pricing</Link></li>
                <li><Link to={`/${PANEL_IDS.CONTACT}`} className="font-body text-sm text-white/50 hover:text-white transition-colors duration-[180ms]">Contact</Link></li>
              </ul>
            </div>

            <div>
              <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-4">Contact</p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-white/50 text-sm">
                  <Mail size={14} className="mt-0.5 text-accent shrink-0" />
                  <div className="flex flex-col gap-0.5">
                    <a href="mailto:cliff@technefiber.com" className="hover:text-white transition-colors duration-[180ms] font-body">cliff@technefiber.com</a>
                    <a href="mailto:info@technefiber.com" className="hover:text-white transition-colors duration-[180ms] font-body">info@technefiber.com</a>
                  </div>
                </li>
                <li className="flex items-center gap-3 text-white/50 text-sm">
                  <Phone size={14} className="text-accent shrink-0" />
                  <div className="flex flex-col gap-0.5">
                    <span className="flex items-center gap-1.5 font-mono text-xs">
                      <MessageSquare size={11} className="text-white/30" />
                      +63 968 702 8433
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-3 text-white/50 text-sm">
                  <MapPin size={14} className="mt-0.5 text-accent shrink-0" />
                  <span className="font-body">Cebu City, Philippines</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-mono text-xs text-white/30">
              © {new Date().getFullYear()} Techne. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link to="/999999999" className="font-body text-xs text-white/30 hover:text-white/60 transition-colors duration-[180ms]">Privacy Policy</Link>
              <Link to="/888888888" className="font-body text-xs text-white/30 hover:text-white/60 transition-colors duration-[180ms]">Terms of Service</Link>
              <a href="https://www.facebook.com/techne.consulting" target="_blank" rel="noopener noreferrer" className="font-body text-xs text-white/30 hover:text-white/60 transition-colors duration-[180ms]">Facebook</a>
            </div>
          </div>

        </div>
      </footer>
    </>
  );
};
