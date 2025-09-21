import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
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
          <Routes>
            <Route path="/" element={
              <>
                <Home />
                <Service />
                <StatsSection />
                <RetrievalModels />
                <DeploymentOption />
                <DeveloperResources />
                <OurMission />
              </>
            } />
            <Route path="/products" element={<Products />} />
            <Route path="/solutions" element={<Solutions />} />
            <Route path="/company" element={<Company />} />
            <Route path="/developers" element={<Developers />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfUse />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
          <BuildInfo />
        </div>
      </Top3DSection>
    </Router>
  );
}

export default App;
