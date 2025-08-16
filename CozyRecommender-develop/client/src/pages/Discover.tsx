import { useState } from "react";
import { useAuthStore } from "@/store/auth";
import { SEOHead } from "@/components/SEOHead";
import { UnderConstructionBanner } from "@/components/UnderConstructionBanner";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Heart, Film, Book, Music, Sparkles, Search, Filter, Shuffle, Eye, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { RecommendationModal } from "@/components/RecommendationModal";
import { Link } from "wouter";

type RecommendationType = 'movie' | 'book' | 'music';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  metadata?: any;
  type: RecommendationType;
  mood?: string;
}

const moods = [
  { id: 'relaxed', name: 'Relaxed', icon: '🧘', color: 'bg-blue-100 text-blue-800' },
  { id: 'energetic', name: 'Energetic', icon: '⚡', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'creative', name: 'Creative', icon: '🎨', color: 'bg-purple-100 text-purple-800' },
  { id: 'nostalgic', name: 'Nostalgic', icon: '💭', color: 'bg-pink-100 text-pink-800' },
  { id: 'romantic', name: 'Romantic', icon: '💕', color: 'bg-rose-100 text-rose-800' },
  { id: 'adventurous', name: 'Adventurous', icon: '🌟', color: 'bg-orange-100 text-orange-800' },
  { id: 'mysterious', name: 'Mysterious', icon: '🔮', color: 'bg-indigo-100 text-indigo-800' },
  { id: 'uplifting', name: 'Uplifting', icon: '🌈', color: 'bg-green-100 text-green-800' },
  { id: 'contemplative', name: 'Contemplative', icon: '🤔', color: 'bg-gray-100 text-gray-800' },
  { id: 'festive', name: 'Festive', icon: '🎉', color: 'bg-red-100 text-red-800' }
];

const contentTypes = [
  { id: 'movie', name: 'Movies', icon: Film, color: 'text-orange-600' },
  { id: 'book', name: 'Books', icon: Book, color: 'text-purple-600' },
  { id: 'music', name: 'Music', icon: Music, color: 'text-pink-600' }
];

export default function Discover() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  
  const discoverStructuredData = {
    "@context": "https://schema.org",
    "@type": ["WebPage", "SearchResultsPage"],
    "name": "Search Movies, Books & Music - Entertainment Discovery",
    "description": "Advanced search for movies, books, and music. Find any title, author, artist, genre, or get personalized recommendations.",
    "url": "https://cozy-recommendations.replit.app/discover",
    "isPartOf": {
      "@type": "WebApplication",
      "name": "Cozy Entertainment Search"
    },
    "mainEntity": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://cozy-recommendations.replit.app/discover?type={content_type}&q={search_term}"
      },
      "query-input": [
        "required name=content_type",
        "required name=search_term"
      ]
    },
    "audience": {
      "@type": "Audience",
      "audienceType": "Entertainment seekers, movie lovers, book readers, music enthusiasts"
    },
    "about": [
      {
        "@type": "Thing",
        "name": "Movie Search",
        "description": "Search movies by title, director, actor, genre, year"
      },
      {
        "@type": "Thing", 
        "name": "Book Search",
        "description": "Find books by author, title, genre, subject, ISBN"
      },
      {
        "@type": "Thing",
        "name": "Music Search", 
        "description": "Discover music by artist, album, song, genre, year"
      }
    ],
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
            "@id": "https://cozy-recommendations.replit.app/discover",
            "name": "Search & Discover"
          }
        }
      ]
    }
  };
  const [selectedMood, setSelectedMood] = useState<string>('relaxed');
  const [selectedType, setSelectedType] = useState<string>('movie');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<Recommendation | null>(null);
  const [selectedModalType, setSelectedModalType] = useState<RecommendationType>('movie');

  // Fetch recommendations based on current filters
  const fetchRecommendations = async () => {
    if (!user || !selectedMood || !selectedType) return [];
    
    const params = new URLSearchParams({
      mood: selectedMood,
      type: selectedType,
    });

    const response = await fetch(`/api/recommendations/${user.id}?${params}`);
    if (!response.ok) throw new Error("Failed to fetch recommendations");
    const data = await response.json();
    
    return data.filter((item: any) => item.type === selectedType);
  };

  const { data: allRecommendations = [], isLoading } = useQuery({
    queryKey: ['/api/recommendations', user?.id, selectedMood, selectedType],
    queryFn: fetchRecommendations,
    enabled: !!user?.id && !!selectedMood && !!selectedType,
  });

  // Add to favorites
  const addToFavoritesMutation = useMutation({
    mutationFn: async (item: Recommendation) => {
      if (!user) throw new Error("User not authenticated");
      const response = await fetch(`/api/favorites/${user.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (!response.ok) throw new Error("Failed to add to favorites");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/favorites'] });
      toast({
        title: "Added to favorites",
        description: "Item has been added to your favorites.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add to favorites.",
        variant: "destructive",
      });
    },
  });

  // Filter recommendations by search query
  const filteredRecommendations = allRecommendations.filter((rec: Recommendation) => {
    const matchesSearch = !searchQuery || 
      rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (rec.description && rec.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesSearch;
  });

  const handleGenerateRandom = () => {
    const randomMood = moods[Math.floor(Math.random() * moods.length)];
    const randomType = contentTypes[Math.floor(Math.random() * contentTypes.length)];
    
    setSelectedMood(randomMood.id);
    setSelectedType(randomType.id);
    
    toast({
      title: "Generating recommendations",
      description: `Fetching ${randomType.name.toLowerCase()} for ${randomMood.name.toLowerCase()} mood...`,
    });
  };

  const openModal = (item: Recommendation, type: RecommendationType) => {
    setSelectedItem(item);
    setSelectedModalType(type);
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

  const handleAddToFavorites = () => {
    if (selectedItem) {
      addToFavoritesMutation.mutate(selectedItem);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-8 h-8 mx-auto mb-4 text-purple-600 animate-spin" />
          <p className="text-gray-600">Discovering amazing content for you...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title="Search Movies, Books & Music - Discover Entertainment | Cozy"
        description="Search and explore movies, books, and music with AI-powered discovery. Find specific titles, authors, artists, or discover new content based on your preferences and mood."
        keywords="search movies, find books, discover music, movie search, book finder, music explorer, film discovery, novel search, song recommendations, entertainment finder"
        canonical="https://cozy-recommendations.replit.app/discover"
        structuredData={discoverStructuredData}
        searchTerms={[
          "search movies online", "find books to read", "discover new music",
          "movie database search", "book recommendation finder", "music suggestion engine",
          "film search engine", "novel finder", "song discovery", "artist search",
          "genre search", "author finder", "director search", "album finder"
        ]}
        contentType="general"
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <UnderConstructionBanner />
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-between mb-6">
            <Link href="/dashboard">
              <Button variant="outline" className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                Return to Dashboard
              </Button>
            </Link>
            <div></div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <Sparkles className="w-8 h-8 text-purple-600" />
            Discover Amazing Content
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore personalized recommendations tailored to your mood and preferences
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search recommendations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedMood('');
                  setSelectedType('');
                  setSearchQuery('');
                }}
                className="flex-1"
              >
                <Filter className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>

            <Button
              onClick={handleGenerateRandom}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Shuffle className="w-4 h-4 mr-2" />
              Surprise Me
            </Button>
          </div>

          {/* Mood Filter */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Choose Mood</h3>
            <div className="flex flex-wrap gap-2">
              {moods.map((mood) => (
                <Badge
                  key={mood.id}
                  variant={selectedMood === mood.id ? "default" : "secondary"}
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedMood === mood.id ? mood.color : 'hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedMood(mood.id)}
                >
                  <span className="mr-1">{mood.icon}</span>
                  {mood.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* Type Filter */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Choose Content Type</h3>
            <div className="flex flex-wrap gap-2">
              {contentTypes.map((type) => (
                <Badge
                  key={type.id}
                  variant={selectedType === type.id ? "default" : "secondary"}
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedType === type.id ? 'bg-primary text-white' : 'hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedType(type.id)}
                >
                  <type.icon className={`w-4 h-4 mr-2 ${type.color}`} />
                  {type.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-gray-900">
              {filteredRecommendations.length} recommendations found
            </h2>
            {(selectedMood || selectedType || searchQuery) && (
              <Badge variant="outline" className="text-gray-600">
                {selectedMood && `${moods.find(m => m.id === selectedMood)?.name} mood`}
                {selectedMood && selectedType && ' • '}
                {selectedType && `${contentTypes.find(t => t.id === selectedType)?.name}`}
                {(selectedMood || selectedType) && searchQuery && ' • '}
                {searchQuery && `"${searchQuery}"`}
              </Badge>
            )}
          </div>
        </div>

        {/* Recommendations Grid */}
        {filteredRecommendations.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No recommendations found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your filters or generate new recommendations
            </p>
            <Button
              onClick={handleGenerateRandom}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Recommendations
            </Button>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            selectedType === 'book' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          }`}>
            {filteredRecommendations.map((recommendation: Recommendation) => (
              <RecommendationCard
                key={recommendation.id}
                item={recommendation}
                type={selectedType as RecommendationType}
                onViewDetails={() => openModal(recommendation, selectedType as RecommendationType)}
                onAddToFavorites={() => addToFavoritesMutation.mutate(recommendation)}
              />
            ))}
          </div>
        )}

        <RecommendationModal
          isOpen={!!selectedItem}
          onClose={closeModal}
          item={selectedItem}
          type={selectedModalType}
          onAddToFavorites={handleAddToFavorites}
        />
      </div>
    </div>
    </>
  );
}

function RecommendationCard({ 
  item, 
  type, 
  onViewDetails, 
  onAddToFavorites 
}: { 
  item: Recommendation;
  type: RecommendationType;
  onViewDetails: () => void;
  onAddToFavorites: () => void;
}) {
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-orange-200">
      <div className="relative">
        <div className="relative overflow-hidden">
          {item.imageUrl ? (
            <img 
              src={item.imageUrl} 
              alt={item.title}
              className={`w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                type === 'book' ? 'h-64' : type === 'music' ? 'h-40' : 'h-48'
              }`}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const placeholder = target.nextElementSibling as HTMLElement;
                if (placeholder) {
                  placeholder.classList.remove('hidden');
                }
              }}
            />
          ) : null}
          <div 
            className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 ${
              type === 'book' ? 'h-64' : type === 'music' ? 'h-40' : 'h-48'
            } ${item.imageUrl ? 'hidden' : ''}`}
          >
            <div className="text-center text-gray-500 dark:text-gray-400">
              <div className="text-lg font-semibold mb-1">{type.toUpperCase()}</div>
              <div className="text-sm">No Image</div>
            </div>
          </div>
        </div>
        <div className="absolute top-2 right-2 flex gap-1">
          <Button
            size="sm"
            variant="secondary"
            className="bg-white/90 backdrop-blur-sm rounded-full p-2 w-10 h-10 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              onAddToFavorites();
            }}
          >
            <Heart size={16} className="text-gray-600 hover:text-red-500" />
          </Button>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-medium text-gray-800 dark:text-gray-200 line-clamp-2 mb-1">
              {item.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
              {item.description}
            </p>
          </div>
          
          {/* Basic metadata */}
          <div className="space-y-2">
            {type === 'movie' && item.metadata && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                <span>{item.metadata.genre}</span>
                {item.metadata.duration && <span> • {item.metadata.duration}</span>}
              </div>
            )}
            
            {type === 'book' && item.metadata && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                <span>{item.metadata.author}</span>
                {item.metadata.pages && <span> • {item.metadata.pages} pages</span>}
              </div>
            )}
            
            {type === 'music' && item.metadata && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                <span>{item.metadata.artist}</span>
                {item.metadata.duration && <span> • {item.metadata.duration}</span>}
              </div>
            )}
          </div>

          <Button 
            onClick={onViewDetails}
            className="w-full"
            variant="outline"
          >
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}