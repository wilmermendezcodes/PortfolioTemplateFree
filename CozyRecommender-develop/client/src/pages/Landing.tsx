import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Heart, BookOpen, Music, Film } from "lucide-react";
import { Link } from "wouter";
import { SEOHead } from "@/components/SEOHead";
import { UnderConstructionBanner } from "@/components/UnderConstructionBanner";


export default function Landing() {
  const landingStructuredData = {
    "@context": "https://schema.org",
    "@type": ["WebApplication", "SearchAction"],
    "name": "Cozy - Movie, Book & Music Search Engine",
    "description": "Search and discover movies, books, and music with AI-powered recommendations. Find any title, author, artist, or genre instantly.",
    "url": "https://cozy-recommendations.replit.app/",
    "applicationCategory": "Entertainment",
    "operatingSystem": "Any",
    "potentialAction": [
      {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://cozy-recommendations.replit.app/discover?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    ],
    "offers": {
      "@type": "Offer",
      "price": "1.00",
      "priceCurrency": "USD",
      "description": "Premium unlimited search and recommendations"
    },
    "author": {
      "@type": "Organization",
      "name": "Cozy Entertainment Platform"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1247"
    },
    "serviceType": [
      "Movie Search Engine",
      "Book Recommendation Service", 
      "Music Discovery Platform",
      "Entertainment Search Tool"
    ],
    "featureList": [
      "Search movies by title, genre, director, actor",
      "Find books by author, title, genre, subject",
      "Discover music by artist, album, song, genre",
      "AI-powered personalized recommendations",
      "Mood-based content discovery",
      "Entertainment search engine",
      "Movie database search",
      "Book finder tool",
      "Music recommendation system"
    ],
    "keywords": "movie search, book finder, music discovery, entertainment search engine, film database, novel recommendations, song finder, artist search, genre explorer"
  };

  return (
    <>
      <SEOHead
        title="Cozy - Find Movies, Books & Music | AI-Powered Recommendations"
        description="Search and discover personalized entertainment with Cozy's AI. Find the perfect movies, books, and music based on your mood. Get recommendations for any genre, author, or artist."
        keywords="find movies, search books, discover music, movie finder, book search, music discovery, film recommendations, novel suggestions, song finder, entertainment search, AI recommendations"
        canonical="https://cozy-recommendations.replit.app/"
        structuredData={landingStructuredData}
        searchTerms={[
          "find movies", "search books", "discover music", "movie finder", 
          "book search", "music discovery", "film recommendations", 
          "novel suggestions", "song finder", "entertainment search",
          "movie search engine", "book recommendation engine", "music suggestion app"
        ]}
        contentType="general"
      />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      {/* Under Construction Banner */}
      <div className="container mx-auto px-4 pt-4">
        <UnderConstructionBanner />
      </div>
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Welcome to <span className="text-orange-600">Cozy</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Search and discover movies, books, and music with AI-powered recommendations. 
            Find any title, author, or artist instantly, or get personalized suggestions based on your mood.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/home">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/discover">
              <Button size="lg" variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-50">
                Explore Recommendations
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center border-orange-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <Film className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <CardTitle className="text-orange-900 dark:text-orange-100">Movies</CardTitle>
              <CardDescription>
                Discover authentic cinema recommendations and entertainment content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                Movie Database
              </Badge>
            </CardContent>
          </Card>

          <Card className="text-center border-purple-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <BookOpen className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle className="text-purple-900 dark:text-purple-100">Books</CardTitle>
              <CardDescription>
                Find your next great read from millions of books and literature
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                Book Database
              </Badge>
            </CardContent>
          </Card>

          <Card className="text-center border-red-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <Music className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <CardTitle className="text-red-900 dark:text-red-100">Music</CardTitle>
              <CardDescription>
                Explore artists and genres from comprehensive music collections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary" className="bg-red-100 text-red-800">
                Music Database
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Mood-Based Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Recommendations Based on Your Mood
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Heart className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-blue-800 dark:text-blue-200 font-medium">Relaxed</p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <ArrowRight className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-green-800 dark:text-green-200 font-medium">Energetic</p>
            </div>
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <Film className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-yellow-800 dark:text-yellow-200 font-medium">Creative</p>
            </div>
            <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
              <Music className="h-8 w-8 text-pink-600 mx-auto mb-2" />
              <p className="text-pink-800 dark:text-pink-200 font-medium">Nostalgic</p>
            </div>
          </div>
        </div>

        {/* Features List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Why Choose Cozy?
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Quality Content</h4>
                <p className="text-gray-600 dark:text-gray-300">Curated recommendations from reliable sources</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Mood-Based AI</h4>
                <p className="text-gray-600 dark:text-gray-300">Intelligent recommendations that match your feelings</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Personal Library</h4>
                <p className="text-gray-600 dark:text-gray-300">Save favorites and track your discovery journey</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Free & Premium</h4>
                <p className="text-gray-600 dark:text-gray-300">Start free, upgrade for enhanced features</p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <p className="text-gray-600 dark:text-gray-300 mb-4">Ready to discover your next favorite content?</p>
          <Link href="/dashboard">
            <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white">
              Start Your Journey
            </Button>
          </Link>
        </div>
      </div>
    </div>
    </>
  );
}