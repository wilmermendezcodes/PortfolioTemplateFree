import { useAuthStore } from "@/store/auth";
import { useRecommendationStore } from "@/store/recommendations";
import { SEOHead } from "@/components/SEOHead";
import { UnderConstructionBanner } from "@/components/UnderConstructionBanner";
import { DataProtectionNotice } from "@/components/DataProtectionNotice";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import PsychologicalTriage from "@/components/PsychologicalTriage";
import RecommendationGrid from "@/components/RecommendationGrid";
import SubscriptionCard from "@/components/SubscriptionCard";
import RecentActivity from "@/components/RecentActivity";

import { Heart, Sparkles, MapPin, Cloud, Clock } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuthStore();
  const { 
    selectedMood, 
    detailedPreferences,
    setMood,
    setDetailedPreferences,
    clearPreferences,
    getCurrentTimeGreeting, 
    getCurrentWeather 
  } = useRecommendationStore();

  const getFirstName = (username: string | undefined) => {
    if (!username) return 'Guest';
    return username.split(' ')[0] || username;
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const dashboardStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Dashboard - Cozy Recommendations",
    "description": "Your personalized dashboard for AI-powered movie, book, and music recommendations",
    "url": "https://cozy-recommendations.replit.app/dashboard",
    "isPartOf": {
      "@type": "WebApplication",
      "name": "Cozy"
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "item": {
            "@id": "https://cozy-recommendations.replit.app/",
            "name": "Home"
          }
        },
        {
          "@type": "ListItem",
          "position": 2,
          "item": {
            "@id": "https://cozy-recommendations.replit.app/dashboard",
            "name": "Dashboard"
          }
        }
      ]
    }
  };

  return (
    <>
      <SEOHead
        title="My Recommendations - Movies, Books & Music Dashboard | Cozy"
        description="Your personalized entertainment dashboard. Get AI-powered recommendations for movies, books, and music based on your search history, preferences, and current mood."
        keywords="my recommendations, personalized movies, custom book suggestions, music for me, entertainment dashboard, AI movie finder, personal book search, tailored music discovery"
        canonical="https://cozy-recommendations.replit.app/dashboard"
        structuredData={dashboardStructuredData}
        searchTerms={[
          "my movie recommendations", "personalized book list", "custom music playlist",
          "recommended movies for me", "books I might like", "music based on my taste",
          "personal entertainment finder", "my favorite movies", "my reading list"
        ]}
        contentType="general"
      />
      <div className="min-h-screen">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        <UnderConstructionBanner />
        <div className="mb-6">
          <DataProtectionNotice onClearData={() => {
            localStorage.clear();
            window.location.reload();
          }} />
        </div>
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="bg-cozy-gradient rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-4 md:mb-0">
                <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-2">
                  {getCurrentTimeGreeting()}, {getFirstName(user?.username)} ☀️
                </h1>
                <p className="text-gray-600">Ready to discover something amazing today?</p>
                <div className="flex items-center space-x-2 sm:space-x-4 mt-4 text-xs sm:text-sm text-gray-500">
                  <span className="flex items-center space-x-1">
                    <MapPin size={16} />
                    <span>Development Environment</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Cloud size={16} />
                    <span>{getCurrentWeather()}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Clock size={16} />
                    <span>{getCurrentTime()}</span>
                  </span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
                <Button variant="outline" className="bg-white text-gray-700 px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:shadow-md transition-all duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base">
                  <Heart size={16} className="sm:w-5 sm:h-5" />
                  <span>Favorites</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Psychological Triage */}
          <PsychologicalTriage 
            onComplete={(results) => {
              setMood(results.primaryMood as any);
              setDetailedPreferences({
                primaryMood: results.primaryMood,
                secondaryMood: results.secondaryMood,
                confidence: results.confidence,
                insights: results.insights
              });
            }}
          />

          {/* Recommendation Grid - show when mood is selected */}
          {selectedMood && <RecommendationGrid />}

          {/* Subscription Card */}
          <SubscriptionCard />

          {/* Recent Activity */}
          <RecentActivity />
        </div>
      </main>
    </div>
    </>
  );
}
