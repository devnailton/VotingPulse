import { useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import LoginForm from "@/components/login-form";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function AuthPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  
  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Back to Home Button */}
      <div className="p-4">
        <Link href="/">
          <Button variant="ghost" className="flex items-center gap-2 text-primary">
            <Home size={18} />
            Voltar para Home
          </Button>
        </Link>
      </div>
      
      <div className="flex-1 flex items-center justify-center p-4">
        <LoginForm />
      </div>
    </div>
  );
}
