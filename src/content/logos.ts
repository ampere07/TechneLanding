import amazon from '../assets/CDNS/Amazon_logo.svg.webp';
import zenlayer from '../assets/CDNS/Logo (1).png';
import meta from '../assets/CDNS/Meta_Platforms_Inc._logo.svg.png';
import netskope from '../assets/CDNS/Netskope_logo_logotype.png';
import opera from '../assets/CDNS/Opera_Software_logo.png';
import riot from '../assets/CDNS/Riot_Games_2022.svg';
import steam from '../assets/CDNS/Steam_logo.svg';
import tencent from '../assets/CDNS/Tencent_Logo.svg.png';
import twitch from '../assets/CDNS/Twitch_logo_2019.svg.png';
import alibaba from '../assets/CDNS/alibaba-brand-color.png';

import vsol from '../assets/trusted/6.png';
import arista from '../assets/trusted/Arista-networks-logo.svg';
import cisco from '../assets/trusted/Cisco_logo_blue_2016.svg.png';
import dell from '../assets/trusted/Dell_Logo.png';
import hp from '../assets/trusted/HP_logo_2012.svg.png';
import huawei from '../assets/trusted/Huawei_Standard_logo.svg.png';
import juniper from '../assets/trusted/Juniper_Networks_logo.svg.png';
import proxmox from '../assets/trusted/Logo_Proxmox.svg';
import mikrotik from '../assets/trusted/MikroTik_Logo_(2022).svg.png';
import pfsense from '../assets/trusted/PfSense_logo.png';
import supermicro from '../assets/trusted/Super_Micro_Computer_Logo.svg.png';
import zte from '../assets/trusted/ZTE-logo.svg.png';
import libreqos from '../assets/trusted/libreqos.logo.svg';
import akvorado from '../assets/trusted/akvorado.svg';
import bind9 from '../assets/trusted/bind9.png';
import cacti from '../assets/trusted/cacti.svg';
import librenms from '../assets/trusted/librenms.png';
import powerdns from '../assets/trusted/powerdns.png';
import ruijie from '../assets/trusted/ruijie.svg';
import smokeping from '../assets/trusted/smokeping.png';
import smokepingDark from '../assets/trusted/smokeping-dark.png';
import tplink from '../assets/trusted/tp-link.svg';

export interface Logo {
  name: string;
  /** The logo image. Without one, the name is shown as text. */
  src?: string;
  /** A version of the logo for dark mode, when the normal one would not show on a dark page. */
  srcDark?: string;
  /** Text shown beside the image, for a logo that is only a symbol and has no name in it. */
  label?: string;
}

export const CONTENT_LOGOS: Logo[] = [
  { name: 'Meta', src: meta },
  { name: 'Amazon', src: amazon },
  { name: 'Alibaba', src: alibaba },
  { name: 'Tencent', src: tencent },
  { name: 'Twitch', src: twitch },
  { name: 'Steam', src: steam },
  { name: 'Riot Games', src: riot },
  { name: 'Zenlayer', src: zenlayer },
  { name: 'Opera', src: opera },
  { name: 'Netskope', src: netskope },
];

export const PLATFORM_LOGOS: Logo[] = [
  { name: 'Cisco', src: cisco },
  { name: 'Juniper Networks', src: juniper },
  { name: 'Arista Networks', src: arista },
  { name: 'MikroTik', src: mikrotik },
  { name: 'Huawei', src: huawei },
  { name: 'ZTE', src: zte },
  { name: 'Dell', src: dell },
  { name: 'HP', src: hp },
  { name: 'Supermicro', src: supermicro },
  { name: 'V-SOL', src: vsol },
  { name: 'Proxmox VE', src: proxmox },
  { name: 'pfSense', src: pfsense },
  { name: 'LibreQoS', src: libreqos },
  { name: 'TP-Link', src: tplink },
  { name: 'Ruijie', src: ruijie },
  { name: 'Cacti', src: cacti, label: 'Cacti' },
  { name: 'LibreNMS', src: librenms },
  { name: 'SmokePing', src: smokeping, srcDark: smokepingDark },
  { name: 'Akvorado', src: akvorado, label: 'Akvorado' },
  { name: 'syslog' },
  { name: 'Weathermap' },
  { name: 'Oxidized' },
  { name: 'RANCID' },
  { name: 'BIND 9', src: bind9 },
  { name: 'PowerDNS', src: powerdns },
];
