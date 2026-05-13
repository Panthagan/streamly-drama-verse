import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/layout/AppLayout";
import Home from "./pages/Home";
import DramaDetail from "./pages/DramaDetail";
import Tropes from "./pages/Tropes";
import TropeDetail from "./pages/TropeDetail";
import Discover from "./pages/Discover";
import Community from "./pages/Community";
import Watchlist from "./pages/Watchlist";
import BingePlanner from "./pages/BingePlanner";
import MoodCheckIn, { isOnboarded } from "./pages/MoodCheckIn";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false, retry: 1 } },
});

const RootGate = () => (isOnboarded() ? <Navigate to="/home" replace /> : <MoodCheckIn />);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<RootGate />} />
            <Route path="/home" element={<Home />} />
            <Route path="/mood" element={<MoodCheckIn />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/community" element={<Community />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/planner" element={<BingePlanner />} />
            <Route path="/drama/:id" element={<DramaDetail />} />
            <Route path="/tropes" element={<Tropes />} />
            <Route path="/tropes/:id" element={<TropeDetail />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
