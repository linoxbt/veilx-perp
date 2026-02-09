import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import PriceChart from "@/components/PriceChart";
import TradingInterface from "@/components/TradingInterface";
import HowItWorks from "@/components/HowItWorks";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <section id="trade" className="py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Private Trading <span className="text-gradient">Terminal</span>
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              All order data is encrypted via Arcium MPC before reaching the matching engine.
            </p>
          </div>
          <div className="max-w-5xl mx-auto mb-6">
            <PriceChart />
          </div>
          <TradingInterface />
        </div>
      </section>
      <HowItWorks />
      <FeaturesSection />
      <Footer />
    </div>
  );
};

export default Index;
