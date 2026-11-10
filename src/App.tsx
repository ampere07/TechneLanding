import { useEffect } from 'react';
import { MotionConfig } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route, useParams, Navigate, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { HomeJourney } from './components/HomeJourney';
import { Services } from './components/Services';
import { ContactForm } from './components/ContactForm';
import { Footer } from './components/Footer';
import { Blog } from './components/Blog';
import { BlogPost } from './components/BlogPost';
import { NetworkBuildout } from './components/NetworkBuildout';
import { About } from './components/About';
import { Pricing } from './components/Pricing';
import { IPTransit } from './components/IPTransit';
import { DIA } from './components/DIA';
import { Colocation } from './components/Colocation';
import { NetworkConsulting } from './components/NetworkConsulting';
import { CoreConfig, DistConfig, SystemIntegration, ProtectiveDNS } from './components/NewManagedServices';
import { Content } from './components/Content';
import { MetroE } from './components/MetroE';
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
import { HOME_PATH, PANEL_IDS, RETIRED_BLOG_IDS } from './constants';

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
  const location = useLocation();

  switch (id) {
    case PANEL_IDS.HOME:
      // The old numeric home address goes to the root, keeping any #section.
      return <Navigate to={{ pathname: HOME_PATH, hash: location.hash }} replace />;
    case PANEL_IDS.SERVICES:
      return <Services />;
    case PANEL_IDS.BLOG:
      return <Blog />;
    case PANEL_IDS.NETWORK_BUILDOUT:
      return <NetworkBuildout />;
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
    case PANEL_IDS.METRO_E:
      return <MetroE />;
    case PANEL_IDS.VIRTUAL_CROSS_CONNECT:
      return <VirtualCrossConnect />;
    case PANEL_IDS.VIRTUAL_SWITCH:
      return <VirtualSwitch />;
    case PANEL_IDS.VIRTUAL_ROUTER:
      return <VirtualRouter />;

    default:
      // Links to the removed articles go to the blog page. Anything else unknown goes home.
      if (id && RETIRED_BLOG_IDS.includes(id)) return <Navigate to={`/${PANEL_IDS.BLOG}`} replace />;
      return <Navigate to={HOME_PATH} replace />;
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
            <Route path={HOME_PATH} element={<HomePanel />} />
            <Route path={`/${PANEL_IDS.BLOG}/:slug`} element={<BlogPost />} />
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
