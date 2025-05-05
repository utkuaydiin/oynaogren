
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import HowItWorks from "./pages/HowItWorks";
import Examples from "./pages/Examples";
import NotFound from "./pages/NotFound";
import SavedSimulations from "./pages/SavedSimulations";
import Auth from "./pages/Auth";
import SimulationDetail from "./pages/SimulationDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/examples" element={<Examples />} />
            <Route path="/saved-simulations" element={<SavedSimulations />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/simulation/:id" element={<SimulationDetail />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
