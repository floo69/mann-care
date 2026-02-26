import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useAppState } from "@/context/AppContext";
import Dashboard from "./pages/Dashboard";
import Onboarding from "./pages/Onboarding";
import Assessment from "./pages/Assessment";
import ClinicalMode from "./pages/ClinicalMode";
import CalmingTools from "./pages/CalmingTools";
import StressRelief from "./pages/StressRelief";
import ProgressPage from "./pages/Progress";
import WorkLifeBalance from "./pages/WorkLifeBalance";
import Explore from "./pages/Explore";
import Journal from "./pages/Journal";
import Profile from "./pages/Profile";
import Resources from "./pages/Resources";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { auth, profile } = useAppState();
  if (!auth.isLoggedIn) return <Navigate to="/auth" replace />;
  if (!profile.onboarded) return <Navigate to="/onboarding" replace />;
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/assessment" element={<ProtectedRoute><Assessment /></ProtectedRoute>} />
            <Route path="/clinical" element={<ProtectedRoute><ClinicalMode /></ProtectedRoute>} />
            <Route path="/calming" element={<ProtectedRoute><CalmingTools /></ProtectedRoute>} />
            <Route path="/stress-relief" element={<ProtectedRoute><StressRelief /></ProtectedRoute>} />
            <Route path="/progress" element={<ProtectedRoute><ProgressPage /></ProtectedRoute>} />
            <Route path="/work-life" element={<ProtectedRoute><WorkLifeBalance /></ProtectedRoute>} />
            <Route path="/explore" element={<ProtectedRoute><Explore /></ProtectedRoute>} />
            <Route path="/journal" element={<ProtectedRoute><Journal /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/resources" element={<ProtectedRoute><Resources /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
