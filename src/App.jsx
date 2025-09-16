import DeploymentOption from "./components/DeploymentOption";
import DeveloperResources from "./components/DeveloperResources";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Home from "./components/Home";
import LogoCarousel from "./components/LogoCarousel";
import OurMission from "./components/OurMission";
import RetrievalModels from "./components/RetrievalModels";
import Service from "./components/Service";
import Top3DSection from "./components/Top3DSection";
import BuildInfo from "./components/BuildInfo";

function App() {
  return (
    <Top3DSection>
      <div className="main-container">
        <Header />
        <Home />
        <Service />
        <RetrievalModels />
        <DeploymentOption />
        <DeveloperResources />
        <OurMission />
        <Footer />
        <BuildInfo />
      </div>
    </Top3DSection>
  
  );
}

export default App;
