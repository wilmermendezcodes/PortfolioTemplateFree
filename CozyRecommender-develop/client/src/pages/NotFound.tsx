import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Home, Search, ArrowLeft } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";

export default function NotFound() {
  return (
    <>
      <SEOHead
        title="Page Not Found - Cozy Recommendations"
        description="The page you're looking for doesn't exist. Return to Cozy's homepage to discover AI-powered movie, book, and music recommendations."
        keywords="404, page not found, error"
        noIndex={true}
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-8">
            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-orange-600" />
            </div>
            <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
            <p className="text-gray-600 mb-8">
              The page you're looking for doesn't exist. Let's get you back to discovering great content!
            </p>
          </div>
          
          <div className="space-y-4">
            <Link href="/">
              <Button size="lg" className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Button>
            </Link>
            
            <Link href="/discover">
              <Button size="lg" variant="outline" className="w-full border-orange-600 text-orange-600 hover:bg-orange-50">
                <Search className="w-4 h-4 mr-2" />
                Discover Content
              </Button>
            </Link>
            
            <Button
              size="lg"
              variant="ghost"
              className="w-full text-gray-600 hover:text-gray-900"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}