import { useState, useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Proposals from "@/pages/Proposals";
import Login from "@/pages/Login";
import Header from "@/components/Header";

function AuthenticatedApp({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="min-h-screen bg-background">
      <Header onLogout={onLogout} />
      <main>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/propostas" component={Proposals} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const { data: authStatus, isLoading } = useQuery<{ authenticated: boolean; user?: string }>({
    queryKey: ["/api/auth/status"],
    staleTime: 0,
  });

  useEffect(() => {
    if (authStatus) {
      setIsAuthenticated(authStatus.authenticated);
    }
  }, [authStatus]);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    queryClient.invalidateQueries({ queryKey: ["/api/auth/status"] });
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setIsAuthenticated(false);
      queryClient.clear();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (isLoading || isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return <AuthenticatedApp onLogout={handleLogout} />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppContent />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
