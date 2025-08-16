import { Link } from "wouter";
import { useAuthStore } from "@/store/auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sparkles, Bell, ChevronDown, Menu, X, Home } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

export default function Navigation() {
  const { user, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location, navigate] = useLocation();

  const getInitials = (username: string | undefined) => {
    if (!username) return 'U';
    return username
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                <Sparkles className="text-white" size={16} />
              </div>
              <span className="text-xl font-semibold text-gray-800">Cozy</span>
            </div>
            <div className="hidden md:flex space-x-6">
              <Link 
                href="/dashboard"
                className={`hover:text-gray-800 transition-colors duration-200 py-2 px-1 border-b-2 font-medium ${
                  location === '/dashboard' || location === '/' 
                    ? 'text-gray-600 border-primary' 
                    : 'text-gray-500 border-transparent hover:border-gray-300'
                }`}
              >
                Dashboard
              </Link>
              <Link 
                href="/recommendations"
                className={`hover:text-gray-800 transition-colors duration-200 py-2 px-1 border-b-2 font-medium ${
                  location === '/recommendations' || location === '/discover'
                    ? 'text-gray-600 border-primary' 
                    : 'text-gray-500 border-transparent hover:border-gray-300'
                }`}
              >
                Discover
              </Link>
              <Link 
                href="/subscription"
                className={`hover:text-gray-800 transition-colors duration-200 py-2 px-1 border-b-2 font-medium ${
                  location === '/subscription'
                    ? 'text-gray-600 border-primary' 
                    : 'text-gray-500 border-transparent hover:border-gray-300'
                }`}
              >
                Subscription
              </Link>
              <Link 
                href="/profile"
                className={`hover:text-gray-800 transition-colors duration-200 py-2 px-1 border-b-2 font-medium ${
                  location === '/profile'
                    ? 'text-gray-600 border-primary' 
                    : 'text-gray-500 border-transparent hover:border-gray-300'
                }`}
              >
                Profile
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="md:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
            
            <Button variant="ghost" size="sm" className="hidden md:block p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
              <Bell size={20} />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-gradient-to-br from-accent to-success text-white text-sm font-medium">
                      G
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:block text-sm font-medium text-gray-700">
                    Guest
                  </span>
                  <ChevronDown className="text-gray-400" size={12} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <Link href="/profile">
                  <DropdownMenuItem>Profile & Settings</DropdownMenuItem>
                </Link>
                <DropdownMenuItem onClick={logout}>Sign Out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 py-4 space-y-2">
            <Link 
              href="/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                location === '/dashboard' || location === '/' 
                  ? 'bg-primary text-white' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Dashboard
            </Link>
            <Link 
              href="/recommendations"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                location === '/recommendations' || location === '/discover'
                  ? 'bg-primary text-white' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Discover
            </Link>
            <Link 
              href="/subscription"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                location === '/subscription'
                  ? 'bg-primary text-white' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Subscription
            </Link>
            <Link 
              href="/profile"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                location === '/profile'
                  ? 'bg-primary text-white' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Profile
            </Link>
            <div className="pt-2 border-t border-gray-100">
              <Button 
                variant="ghost" 
                className="w-full justify-start px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              >
                <Bell size={20} className="mr-2" />
                Notifications
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  logout();
                }}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
