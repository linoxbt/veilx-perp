import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import TradingInterface from "@/components/TradingInterface";
import HowItWorks from "@/components/HowItWorks";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <TradingInterface />
      <HowItWorks />
      <FeaturesSection />
      <Footer />
    </div>
  );
};

export default Index;
