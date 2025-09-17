import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuthState, useAuth } from "@/hooks/useAuth";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";
import { SymptomReportForm } from "@/components/SymptomReportForm";
import { VisitEntryForm } from "@/components/VisitEntryForm";
import { LabReportForm } from "@/components/LabReportForm";
import { CreateAlertForm } from "@/components/CreateAlertForm";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>;
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

const AppContent = () => {
  const authState = useAuthState();
  
  return (
    <AuthProvider value={authState}>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Index />
            </ProtectedRoute>
          } />
          <Route path="/report-symptoms" element={
            <ProtectedRoute>
              <div className="min-h-screen bg-background p-4">
                <SymptomReportForm />
              </div>
            </ProtectedRoute>
          } />
          <Route path="/enter-visit" element={
            <ProtectedRoute>
              <div className="min-h-screen bg-background p-4">
                <VisitEntryForm />
              </div>
            </ProtectedRoute>
          } />
          <Route path="/lab-report" element={
            <ProtectedRoute>
              <div className="min-h-screen bg-background p-4">
                <LabReportForm />
              </div>
            </ProtectedRoute>
          } />
          <Route path="/create-alert" element={
            <ProtectedRoute>
              <div className="min-h-screen bg-background p-4">
                <CreateAlertForm />
              </div>
            </ProtectedRoute>
          } />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppContent />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
