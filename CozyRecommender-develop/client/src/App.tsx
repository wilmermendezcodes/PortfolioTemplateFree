import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import Subscription from "@/pages/Subscription";
import Discover from "@/pages/Discover";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";
import { useAuthStore } from "@/store/auth";
import { useEffect } from "react";
import { useLocation } from "wouter";

function Router() {
  const { isAuthenticated } = useAuthStore();
  const [location] = useLocation();

  // Show landing page for root path when not authenticated
  if (!isAuthenticated && location === "/") {
    return <Landing />;
  }

  // Show login for authenticated routes when not logged in
  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/recommendations" component={Discover} />
      <Route path="/discover" component={Discover} />
      <Route path="/subscription" component={Subscription} />
      <Route path="/profile" component={Profile} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
    
    // Prevent browser back navigation from dashboard unless signing out
    const handlePopState = () => {
      const currentPath = window.location.pathname;
      if (currentPath === '/dashboard' || currentPath === '/') {
        // Allow navigation within the app, but prevent going back to external pages
        window.history.pushState(null, '', window.location.href);
      }
    };
    
    window.addEventListener('popstate', handlePopState);
    
    // Push initial state to enable the prevention
    window.history.pushState(null, '', window.location.href);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [initializeAuth]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
