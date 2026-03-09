import { useState, useCallback } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import WalletProvider from "@/components/WalletProvider";
import LoadingScreen from "@/components/LoadingScreen";
import ChatBot from "@/components/ChatBot";
import OnboardingTour from "@/components/OnboardingTour";
import AnimatedRoutes from "@/components/AnimatedRoutes";

const queryClient = new QueryClient();

const App = () => {
  const [loading, setLoading] = useState(true);
  const handleFinished = useCallback(() => setLoading(false), []);

  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          {loading && <LoadingScreen onFinished={handleFinished} />}
          <BrowserRouter>
            <AnimatedRoutes />
          </BrowserRouter>
          <OnboardingTour />
          <ChatBot />
        </TooltipProvider>
      </WalletProvider>
    </QueryClientProvider>
  );
};

export default App;
