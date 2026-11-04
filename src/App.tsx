import { useEffect } from 'react';
import { MotionConfig } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route, useParams, Navigate, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { HomeJourney } from './components/HomeJourney';
import { Services } from './components/Services';
import { ContactForm } from './components/ContactForm';
import { Footer } from './components/Footer';
import { Blog } from './components/Blog';
import { BlogDetail } from './components/BlogDetail';
import { About } from './components/About';
import { Pricing } from './components/Pricing';
import { IPTransit } from './components/IPTransit';
import { DIA } from './components/DIA';
import { Colocation } from './components/Colocation';
import { NetworkConsulting } from './components/NetworkConsulting';
import { CoreConfig, DistConfig, SystemIntegration, ProtectiveDNS } from './components/NewManagedServices';
import { Content } from './components/Content';
import { VirtualCrossConnect, VirtualRouter, VirtualSwitch } from './components/VirtualServices';
import { NetworkMap, TrustedBrands } from './components/NetworkMap';
import { ClosingCTA } from './components/ClosingCTA';
import {
  HomeFAQ,
  Methodology,
  ServiceFinder,
  VirtualCompare,
  WhyChooseTechne,
} from './components/HomeSections';
import { PANEL_IDS } from './constants';

import blogInfra from './assets/insight-infrastructure.webp';
import blogSec from './assets/insight-security.webp';
import blogNet from './assets/insight-connectivity.webp';

const HomePanel = () => (
  <>
    <HomeJourney />
    <ServiceFinder />
    <VirtualCompare />
    <NetworkMap />
    <TrustedBrands />
    <WhyChooseTechne />
    <Methodology />
    <HomeFAQ />
    <ClosingCTA reveal />
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
    case PANEL_IDS.PRICING:
      return <Pricing />;
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
    case PANEL_IDS.CONTENT:
      return <Content />;
    case PANEL_IDS.VIRTUAL_CROSS_CONNECT:
      return <VirtualCrossConnect />;
    case PANEL_IDS.VIRTUAL_SWITCH:
      return <VirtualSwitch />;
    case PANEL_IDS.VIRTUAL_ROUTER:
      return <VirtualRouter />;

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
            Lorem Ipsum è un testo segnaposto utilizzato nel settore della tipografia e della stampa. Lorem Ipsum è considerato il testo segnaposto standard sin dal sedicesimo secolo, quando un anonimo tipografo prese una cassetta di caratteri e li assemblò per preparare un testo campione
            
            Lorem Ipsum è un testo segnaposto utilizzato nel settore della tipografia e della stampa. Lorem Ipsum è considerato il testo segnaposto standard sin dal sedicesimo secolo, quando un anonimo tipografo prese una cassetta di caratteri e li assemblò per preparare un testo campione

            Key considerations for core optimization:
            1. Lorem Ipsum è un testo segnaposto utilizzato nel settore della tipografia e della stampa. Lorem Ipsum è considerato il testo segnaposto standard sin dal sedicesimo secolo, quando un anonimo tipografo prese una cassetta di caratteri e li assemblò per preparare un testo campione.
            2. Lorem Ipsum è un testo segnaposto utilizzato nel settore della tipografia e della stampa. Lorem Ipsum è considerato il testo segnaposto standard sin dal sedicesimo secolo, quando un anonimo tipografo prese una cassetta di caratteri e li assemblò per preparare un testo campione.
            3. Lorem Ipsum è un testo segnaposto utilizzato nel settore della tipografia e della stampa. Lorem Ipsum è considerato il testo segnaposto standard sin dal sedicesimo secolo, quando un anonimo tipografo prese una cassetta di caratteri e li assemblò per preparare un testo campione.
            
            Lorem Ipsum è un testo segnaposto utilizzato nel settore della tipografia e della stampa. Lorem Ipsum è considerato il testo segnaposto standard.
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
            Lorem Ipsum è un testo segnaposto utilizzato nel settore della tipografia e della stampa. Lorem Ipsum è considerato il testo segnaposto standard sin dal sedicesimo secolo, quando un anonimo tipografo prese una cassetta di caratteri e li assemblò per preparare un testo campione
            
            Lorem Ipsum è un testo segnaposto utilizzato nel settore della tipografia e della stampa. Lorem Ipsum è considerato il testo segnaposto standard sin dal sedicesimo secolo, quando un anonimo tipografo prese una cassetta di caratteri e li assemblò per preparare un testo campione

            Key considerations for core optimization:
            1. Lorem Ipsum è un testo segnaposto utilizzato nel settore della tipografia e della stampa. Lorem Ipsum è considerato il testo segnaposto standard sin dal sedicesimo secolo, quando un anonimo tipografo prese una cassetta di caratteri e li assemblò per preparare un testo campione.
            2. Lorem Ipsum è un testo segnaposto utilizzato nel settore della tipografia e della stampa. Lorem Ipsum è considerato il testo segnaposto standard sin dal sedicesimo secolo, quando un anonimo tipografo prese una cassetta di caratteri e li assemblò per preparare un testo campione.
            3. Lorem Ipsum è un testo segnaposto utilizzato nel settore della tipografia e della stampa. Lorem Ipsum è considerato il testo segnaposto standard sin dal sedicesimo secolo, quando un anonimo tipografo prese una cassetta di caratteri e li assemblò per preparare un testo campione.
            
            Lorem Ipsum è un testo segnaposto utilizzato nel settore della tipografia e della stampa. Lorem Ipsum è considerato il testo segnaposto standard.
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
            Lorem Ipsum è un testo segnaposto utilizzato nel settore della tipografia e della stampa. Lorem Ipsum è considerato il testo segnaposto standard sin dal sedicesimo secolo, quando un anonimo tipografo prese una cassetta di caratteri e li assemblò per preparare un testo campione
            
            Lorem Ipsum è un testo segnaposto utilizzato nel settore della tipografia e della stampa. Lorem Ipsum è considerato il testo segnaposto standard sin dal sedicesimo secolo, quando un anonimo tipografo prese una cassetta di caratteri e li assemblò per preparare un testo campione

            Key considerations for core optimization:
            1. Lorem Ipsum è un testo segnaposto utilizzato nel settore della tipografia e della stampa. Lorem Ipsum è considerato il testo segnaposto standard sin dal sedicesimo secolo, quando un anonimo tipografo prese una cassetta di caratteri e li assemblò per preparare un testo campione.
            2. Lorem Ipsum è un testo segnaposto utilizzato nel settore della tipografia e della stampa. Lorem Ipsum è considerato il testo segnaposto standard sin dal sedicesimo secolo, quando un anonimo tipografo prese una cassetta di caratteri e li assemblò per preparare un testo campione.
            3. Lorem Ipsum è un testo segnaposto utilizzato nel settore della tipografia e della stampa. Lorem Ipsum è considerato il testo segnaposto standard sin dal sedicesimo secolo, quando un anonimo tipografo prese una cassetta di caratteri e li assemblò per preparare un testo campione.
            
            Lorem Ipsum è un testo segnaposto utilizzato nel settore della tipografia e della stampa. Lorem Ipsum è considerato il testo segnaposto standard.
          `}
        />
      );
    default:
      return <Navigate to={`/${PANEL_IDS.HOME}`} replace />;
  }
};

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Wait a frame so a section on a newly opened page exists before scrolling to it.
      const frame = requestAnimationFrame(() => {
        document.getElementById(hash.slice(1))?.scrollIntoView();
      });
      return () => cancelAnimationFrame(frame);
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
};

function App() {
  return (
    <MotionConfig reducedMotion="user">
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-paper flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Navigate to={`/${PANEL_IDS.HOME}`} replace />} />
            <Route path="/:id" element={<PanelRenderer />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
    </MotionConfig>
  );
}

export default App;
