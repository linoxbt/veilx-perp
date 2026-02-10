import Header from "@/components/Header";
import MarketSelector from "@/components/MarketSelector";
import PriceChart from "@/components/PriceChart";
import TradingInterface from "@/components/TradingInterface";

const TradePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-[1400px] mx-auto px-4 py-4">
          <MarketSelector />
          <div className="mb-4">
            <PriceChart />
          </div>
          <TradingInterface />
        </div>
      </main>
    </div>
  );
};

export default TradePage;
