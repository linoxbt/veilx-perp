import { Link } from "react-router-dom";
import { Eye, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ArchitectureDiagram from "@/components/ArchitectureDiagram";
import HowItWorks from "@/components/HowItWorks";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />

      {/* Interactive Architecture Diagram */}
      <ArchitectureDiagram />

      {/* CTA banner */}
      <section className="py-12 sm:py-16">
        <div className="container px-4">
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:p-10 text-center max-w-3xl mx-auto">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 text-foreground">
              Ready to trade <span className="text-gradient">privately</span>?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto text-sm sm:text-base">
              Open the trading terminal to start placing encrypted orders on Solana.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/trade"
                className="inline-flex items-center justify-center gap-2 rounded-lg gradient-primary px-6 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base font-semibold text-primary-foreground hover:opacity-90 transition-opacity glow-primary"
              >
                <Eye className="h-4 w-4" />
                Launch Terminal
              </Link>
              <Link
                to="/portfolio"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-6 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base font-semibold text-foreground hover:bg-secondary transition-colors"
              >
                Portfolio
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <HowItWorks />
      <FeaturesSection />
      <Footer />
    </div>
  );
};

export default Index;
