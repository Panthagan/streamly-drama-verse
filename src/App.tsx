import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/layout/AppLayout";
import Home from "./pages/Home";
import DramaDetail from "./pages/DramaDetail";
import Tropes from "./pages/Tropes";
import TropeDetail from "./pages/TropeDetail";
import ComingSoon from "./pages/ComingSoon";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false, retry: 1 } },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/drama/:id" element={<DramaDetail />} />
            <Route path="/tropes" element={<Tropes />} />
            <Route path="/tropes/:id" element={<TropeDetail />} />
            <Route
              path="/community"
              element={<ComingSoon title="Community" description="Episode-by-episode discussions, reactions, and spoiler-safe threads. Launching with the next update." />}
            />
            <Route
              path="/discover"
              element={<ComingSoon title="Discover" description="Advanced filters by year, country, mood, runtime, and more." />}
            />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
