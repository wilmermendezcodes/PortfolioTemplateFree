import { useAuthStore } from "@/store/auth";
import { Button } from "@/components/ui/button";
import { SEOHead } from "@/components/SEOHead";
import { UnderConstructionBanner } from "@/components/UnderConstructionBanner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Star, Zap, Heart, Crown } from "lucide-react";
import { Link } from "wouter";

export default function Subscription() {
  const { user } = useAuthStore();
  const isPremium = user?.subscription === "premium";

  const subscriptionStructuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Cozy Premium Subscription",
    "description": "Premium AI-powered recommendation service for movies, books, and music",
    "brand": {
      "@type": "Brand",
      "name": "Cozy"
    },
    "offers": {
      "@type": "Offer",
      "price": "1.00",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "priceValidUntil": "2025-12-31"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1247"
    }
  };

  const features = {
    free: [
      "5 recommendations per day",
      "Basic mood matching",
      "Save up to 10 favorites",
      "Standard content types"
    ],
    premium: [
      "Unlimited recommendations",
      "Advanced AI mood analysis",
      "Unlimited favorites",
      "Priority content from premium sources",
      "Personalized recommendation history",
      "Early access to new features",
      "Ad-free experience",
      "Custom mood profiles"
    ]
  };

  return (
    <>
      <SEOHead
        title="Premium Subscription - Unlimited AI Recommendations | Cozy"
        description="Upgrade to Cozy Premium for unlimited AI-powered movie, book, and music recommendations. Get advanced mood analysis, unlimited favorites, and ad-free experience for just $1/month."
        keywords="premium subscription, unlimited recommendations, AI recommendations upgrade, cozy premium, entertainment subscription"
        canonical="https://cozy-recommendations.replit.app/subscription"
        structuredData={subscriptionStructuredData}
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Under Construction Banner */}
      <div className="max-w-6xl mx-auto px-4 pt-4">
        <UnderConstructionBanner />
      </div>
      
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 text-gray-700 hover:text-gray-900">
            <Heart className="w-6 h-6 text-pink-500" />
            <span className="text-xl font-semibold">Cozy</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Badge variant={isPremium ? "default" : "secondary"}>
              {isPremium ? "Premium" : "Free Plan"}
            </Badge>
            <Link href="/">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Cozy Experience
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover personalized recommendations that match your mood. Upgrade to Premium for unlimited access and advanced features.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <Card className={`relative ${!isPremium ? 'ring-2 ring-blue-500' : ''}`}>
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
                <Star className="w-6 h-6 text-yellow-500" />
                Free Plan
              </CardTitle>
              <CardDescription className="text-lg">Perfect for getting started</CardDescription>
              <div className="text-4xl font-bold text-gray-900 mt-4">
                $0<span className="text-lg font-normal text-gray-500">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-8">
                {features.free.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              {!isPremium && (
                <Badge className="w-full justify-center py-2 bg-blue-100 text-blue-800">
                  Current Plan
                </Badge>
              )}
              {isPremium && (
                <Button variant="outline" className="w-full" disabled>
                  Downgrade to Free
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className={`relative ${isPremium ? 'ring-2 ring-purple-500' : 'ring-2 ring-purple-200'} shadow-lg`}>
            {!isPremium && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1">
                  Most Popular
                </Badge>
              </div>
            )}
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
                <Crown className="w-6 h-6 text-purple-500" />
                Premium Plan
              </CardTitle>
              <CardDescription className="text-lg">Unlimited cozy recommendations</CardDescription>
              <div className="text-4xl font-bold text-gray-900 mt-4">
                $1<span className="text-lg font-normal text-gray-500">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-8">
                {features.premium.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              {isPremium ? (
                <Badge className="w-full justify-center py-2 bg-purple-100 text-purple-800">
                  Current Plan
                </Badge>
              ) : (
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  <Zap className="w-4 h-4 mr-2" />
                  Upgrade to Premium
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Benefits Section */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Why Choose Premium?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Unlimited Access</h3>
              <p className="text-gray-600">
                Get unlimited recommendations throughout the day, whenever your mood changes.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Personalized Experience</h3>
              <p className="text-gray-600">
                Advanced AI learns your preferences to provide increasingly accurate recommendations.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Crown className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Content</h3>
              <p className="text-gray-600">
                Access to curated content from premium sources and early releases.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}