import Header from "@/components/Header";
import MarketSelector from "@/components/MarketSelector";
import PriceChart from "@/components/PriceChart";
import TradingInterface from "@/components/TradingInterface";
import FundingRateDisplay from "@/components/FundingRateDisplay";

const TradePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-[1400px] mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <MarketSelector />
          <div className="mb-4">
            <PriceChart />
          </div>
          <div className="mb-4">
            <FundingRateDisplay />
          </div>
          <TradingInterface />
        </div>
      </main>
    </div>
  );
};

export default TradePage;
