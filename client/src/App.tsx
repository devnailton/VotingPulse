import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { WebSocketProvider } from "@/hooks/use-websocket";
import { ProtectedRoute } from "@/lib/protected-route";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import ProfessorDashboard from "@/pages/professor-dashboard";
import FavorPanel from "@/pages/favor-panel";
import ContraPanel from "@/pages/contra-panel";

function Router() {
  return (
    <Switch>
      <ProtectedRoute 
        path="/" 
        component={() => {
          // Redirect based on user role
          return <Route path="/">
            <Redirect />
          </Route>;
        }} 
      />
      <ProtectedRoute 
        path="/professor" 
        component={ProfessorDashboard} 
        allowedRoles={["professor"]} 
      />
      <ProtectedRoute 
        path="/favor" 
        component={FavorPanel} 
        allowedRoles={["favor"]} 
      />
      <ProtectedRoute 
        path="/contra" 
        component={ContraPanel} 
        allowedRoles={["contra"]} 
      />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

// Redirect component to handle role-based routing
function Redirect() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  
  useEffect(() => {
    if (user) {
      switch (user.role) {
        case "professor":
          navigate("/professor");
          break;
        case "favor":
          navigate("/favor");
          break;
        case "contra":
          navigate("/contra");
          break;
        default:
          navigate("/auth");
      }
    }
  }, [user, navigate]);
  
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <WebSocketProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </WebSocketProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

import { useEffect } from "react";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default App;
