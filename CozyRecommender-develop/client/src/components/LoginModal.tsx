import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuthStore } from "@/store/auth";
import { useToast } from "@/hooks/use-toast";
import { Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DevelopmentDataNotice } from "@/components/DevelopmentDataNotice";
import { useLocation } from "wouter";

export default function LoginModal() {
  const [username, setUsername] = useState("");
  const { login, isLoading } = useAuthStore();
  const { toast } = useToast();
  const [, navigate] = useLocation();

  // Generate a random guest username
  const generateGuestUsername = () => {
    const adjectives = ["Cool", "Happy", "Smart", "Creative", "Curious", "Friendly", "Bright", "Clever"];
    const nouns = ["Explorer", "Reader", "Listener", "Watcher", "Discoverer", "Fan", "Enthusiast", "Seeker"];
    const number = Math.floor(Math.random() * 1000);
    return `${adjectives[Math.floor(Math.random() * adjectives.length)]}${nouns[Math.floor(Math.random() * nouns.length)]}${number}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Use provided username or generate a guest one
    const finalUsername = username.trim() || generateGuestUsername();

    try {
      await login(finalUsername);
      navigate('/dashboard');
      toast({
        title: "Welcome to Cozy!",
        description: `Logged in as ${finalUsername}`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Please try again.",
      });
    }
  };

  const handleGuestLogin = () => {
    const guestUsername = generateGuestUsername();
    setUsername(guestUsername);
    login(guestUsername).then(() => {
      navigate('/dashboard');
      toast({
        title: "Welcome to Cozy!",
        description: `Exploring as ${guestUsername}`,
      });
    }).catch(() => {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Please try again.",
      });
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <DevelopmentDataNotice />
        <Card className="shadow-2xl">
        <CardHeader className="text-center pb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="text-white" size={32} />
          </div>
          <CardTitle className="text-2xl font-semibold text-gray-800">
            Welcome to Cozy
          </CardTitle>
          <CardDescription>
            Explore recommendations anonymously
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                Anonymous exploration - no personal data collected
              </p>
              <p className="text-xs text-gray-500">
                Completely anonymous usage for testing recommendations
              </p>
            </div>
            
            <Button 
              type="button"
              onClick={handleGuestLogin}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 px-4 rounded-xl hover:shadow-lg transition-all duration-200 font-medium"
            >
              {isLoading ? "Entering..." : "Continue as Guest"}
            </Button>
            
            <div className="text-center">
              <p className="text-xs text-gray-500">
                No registration, data collection, or personal information required
              </p>
            </div>
          </div>
        </CardContent>
        </Card>
      </div>
    </div>
  );
}
