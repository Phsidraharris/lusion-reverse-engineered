import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import DeploymentOption from './components/DeploymentOption';
import DeveloperResources from './components/DeveloperResources';
import Footer from './components/Footer';
import Header from './components/Header';
import Home from './components/Home';
import LogoCarousel from './components/LogoCarousel';
import OurMission from './components/OurMission';
import RetrievalModels from './components/RetrievalModels';
import Service from './components/Service';
import Top3DSection from './components/Top3DSection';
import BuildInfo from './components/BuildInfo';
import StatsSection from './components/StatsSection';
import PageTransition from './components/PageTransition';

// Import new page components
import Products from './components/Products';
import Solutions from './components/Solutions';
import Company from './components/Company';
import Developers from './components/Developers';
import Contact from './components/Contact';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfUse from './components/TermsOfUse';
import NotFound from './components/NotFound';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-brand-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-accent"></div>
      </div>
    );
  }

  return (
    <Router>
      <Top3DSection>
        <div className="main-container">
          <Header />
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={
                <PageTransition>
                  <>
                    <Home />
                    <Service />
                    <StatsSection />
                    <RetrievalModels />
                    <DeploymentOption />
                    <DeveloperResources />
                    <OurMission />
                  </>
                </PageTransition>
              } />
              <Route path="/products" element={
                <PageTransition>
                  <Products />
                </PageTransition>
              } />
              <Route path="/solutions" element={
                <PageTransition>
                  <Solutions />
                </PageTransition>
              } />
              <Route path="/company" element={
                <PageTransition>
                  <Company />
                </PageTransition>
              } />
              <Route path="/developers" element={
                <PageTransition>
                  <Developers />
                </PageTransition>
              } />
              <Route path="/contact" element={
                <PageTransition>
                  <Contact />
                </PageTransition>
              } />
              <Route path="/privacy" element={
                <PageTransition>
                  <PrivacyPolicy />
                </PageTransition>
              } />
              <Route path="/terms" element={
                <PageTransition>
                  <TermsOfUse />
                </PageTransition>
              } />
              <Route path="*" element={
                <PageTransition>
                  <NotFound />
                </PageTransition>
              } />
            </Routes>
          </AnimatePresence>
          <Footer />
          <BuildInfo />
        </div>
      </Top3DSection>
    </Router>
  );
}

export default App;
