import { BrowserRouter as Router, Routes, Route, useParams, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { ContactForm } from './components/ContactForm';
import { Footer } from './components/Footer';
import { Blog } from './components/Blog';
import { BlogDetail } from './components/BlogDetail';
import { About } from './components/About';
import { IPTransit } from './components/IPTransit';
import { DIA } from './components/DIA';
import { Colocation } from './components/Colocation';
import { NetworkConsulting } from './components/NetworkConsulting';
import { CoreConfig, DistConfig, SystemIntegration, ProtectiveDNS } from './components/NewManagedServices';
import { WhyTechne } from './components/WhyTechne';
import { NetworkMap } from './components/NetworkMap';
import { PANEL_IDS } from './constants';

import blogInfra from './assets/blog_infra.png';
import blogSec from './assets/blog_sec.png';
import blogNet from './assets/blog_net.png';

const HomePanel = () => (
  <>
    <Hero />
    <WhyTechne />
    <NetworkMap />
    <Services />
  </>
);

const PanelRenderer = () => {
  const { id } = useParams();

  switch (id) {
    case PANEL_IDS.HOME:
      return <HomePanel />;
    case PANEL_IDS.SERVICES:
      return <Services />;
    case PANEL_IDS.BLOG:
      return <Blog />;
    case PANEL_IDS.ABOUT:
      return <About />;
    case PANEL_IDS.CONTACT:
      return <ContactForm />;
    case PANEL_IDS.IP_TRANSIT:
      return <IPTransit />;
    case PANEL_IDS.DIA:
      return <DIA />;
    case PANEL_IDS.COLOCATION:
      return <Colocation />;
    case PANEL_IDS.NETWORK_CONSULTING:
      return <NetworkConsulting />;
    case PANEL_IDS.CORE_CONFIG:
      return <CoreConfig />;
    case PANEL_IDS.DIST_CONFIG:
      return <DistConfig />;
    case PANEL_IDS.SYSTEM_INTEGRATION:
      return <SystemIntegration />;
    case PANEL_IDS.PROTECTIVE_DNS:
      return <ProtectiveDNS />;
    
    // Blog Details
    case PANEL_IDS.BLOG_INFRA:
      return (
        <BlogDetail 
          title="Optimizing Core Infrastructure for Scalability"
          category="Infrastructure"
          date="May 10, 2026"
          author="Cliff Richard Perez Jr"
          image={blogInfra}
          content={`
            As internet demand continues to surge across the Philippines, service providers and enterprises face the challenge of scaling their core infrastructure without sacrificing stability. 
            
            The foundation of any high-performance network lies in its core router configuration and backbone fabric. Techne's approach focuses on high-speed fabrics—scaling from 10G to 400G—integrated with redundant architectures like MLAG, ECMP, and VRRP.

            Key considerations for core optimization:
            1. Fabric Density: Ensuring your core switches can handle the north-south and east-west traffic growth.
            2. Routing Protocols: Implementing Segment Routing or MPLS for more efficient traffic engineering.
            3. Congestion Management: Utilizing advanced QoS and traffic shaping to prioritize mission-critical data.
            
            By future-proofing the core, businesses can ensure they are ready for the next decade of digital transformation.
          `}
        />
      );
    case PANEL_IDS.BLOG_SECURITY:
      return (
        <BlogDetail 
          title="The Future of Network Security in the Philippines"
          category="Security"
          date="April 28, 2026"
          author="Cliff Richard Perez Jr"
          image={blogSec}
          content={`
            Cybersecurity is no longer just a technical requirement—it's a regulatory necessity. With the recent NTC mandates, including Memorandum No. 001-01-2025, Value-Added Service providers are now required to implement robust security measures like Protective DNS (PDNS).
            
            Threat actors are becoming increasingly sophisticated, using AI-driven phishing and advanced botnet architectures to target Philippine businesses. 
            
            Techne's multi-layered security framework includes:
            - PDNS Implementation: Actively monitoring and blocking malicious domain queries.
            - RPKI Validation: Protecting your BGP routes from highjacking and route leaks.
            - Automated Threat Intelligence: Real-time updates to edge filters based on global threat patterns.

            Securing the network means protecting not just your data, but your reputation and your customers' trust.
          `}
        />
      );
    case PANEL_IDS.BLOG_NETWORKING:
      return (
        <BlogDetail 
          title="Understanding Next-Gen Global Connectivity"
          category="Networking"
          date="April 15, 2026"
          author="Cliff Richard Perez Jr"
          image={blogNet}
          content={`
            Global connectivity is shifting from centralized transit hubs to localized peering environments. For businesses in Southeast Asia, this means a shift towards direct internet exchange (IX) peering and localized CDN distribution.
            
            Optimizing global traffic involves a complex dance of BGP tuning, MED tuning, and AS-path prepending. By establishing direct sessions with Tier-1 providers and regional IXPs, we can drastically reduce latency for content-rich destinations like Google, Meta, and Netflix.
            
            The benefits of localized peering:
            1. Reduced Latency: Traffic stays local whenever possible, improving the user experience for streaming and gaming.
            2. Cost Efficiency: Reducing reliance on expensive IP transit by utilizing "free" peering at major IXPs.
            3. Resilience: Multiple paths to the global internet ensure that a single cable cut doesn't take your entire network offline.
          `}
        />
      );
    default:
      return <Navigate to={`/${PANEL_IDS.HOME}`} replace />;
  }
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="flex-grow pt-20">
          <Routes>
            <Route path="/" element={<Navigate to={`/${PANEL_IDS.HOME}`} replace />} />
            <Route path="/:id" element={<PanelRenderer />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
