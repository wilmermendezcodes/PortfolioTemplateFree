import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth";
import { useRecommendationStore } from "@/store/recommendations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Film, Book, Music, Heart, Eye } from "lucide-react";
import { RecommendationModal } from "./RecommendationModal";

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

const sections: Array<{
  type: RecommendationType;
  title: string;
  icon: any;
  color: string;
}> = [
  { type: 'movie', title: 'Movies for You', icon: Film, color: 'text-primary' },
  { type: 'book', title: 'Books to Read', icon: Book, color: 'text-secondary' },
  { type: 'music', title: 'Music for Your Soul', icon: Music, color: 'text-accent' },
];

export default function RecommendationGrid() {
  const { user } = useAuthStore();
  const { selectedMood, detailedPreferences, clearPreferences } = useRecommendationStore();
  const { toast } = useToast();
  const [selectedItem, setSelectedItem] = useState<Recommendation | null>(null);
  const [selectedType, setSelectedType] = useState<RecommendationType>('movie');

  const fetchRecommendations = async (type: RecommendationType) => {
    if (!user) throw new Error("User not authenticated");
    
    const params = new URLSearchParams({
      mood: selectedMood || 'relaxed',
      type: type,
    });

    const response = await fetch(`/api/recommendations/${user.id}?${params}`);
    if (!response.ok) throw new Error("Failed to fetch recommendations");
    const data = await response.json();
    
    // Filter by type if multiple types are returned
    return data.filter((item: any) => item.type === type);
  };

  const { data: movieData, isLoading: moviesLoading } = useQuery({
    queryKey: ['/api/recommendations', user?.id, 'movie', selectedMood],
    queryFn: () => fetchRecommendations('movie'),
    enabled: !!user && !!selectedMood,
  });

  const { data: bookData, isLoading: booksLoading } = useQuery({
    queryKey: ['/api/recommendations', user?.id, 'book', selectedMood],
    queryFn: () => fetchRecommendations('book'),
    enabled: !!user && !!selectedMood,
  });

  const { data: musicData, isLoading: musicLoading } = useQuery({
    queryKey: ['/api/recommendations', user?.id, 'music', selectedMood],
    queryFn: () => fetchRecommendations('music'),
    enabled: !!user && !!selectedMood,
  });

  const addToFavorites = useMutation({
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
      toast({
        title: "Added to favorites",
        description: "Item has been added to your favorites.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/favorites'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add to favorites.",
        variant: "destructive",
      });
    },
  });

  const openModal = (item: Recommendation, type: RecommendationType) => {
    setSelectedItem(item);
    setSelectedType(type);
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

  const handleAddToFavorites = () => {
    if (selectedItem) {
      addToFavorites.mutate(selectedItem);
    }
  };

  if (!user || !selectedMood) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Choose Your Mood</h2>
        <p className="text-gray-600 dark:text-gray-400">Select a mood to get personalized recommendations.</p>
      </div>
    );
  }

  const sectionData = {
    movie: movieData || [],
    book: bookData || [],
    music: musicData || [],
  };

  const sectionLoading = {
    movie: moviesLoading,
    book: booksLoading,
    music: musicLoading,
  };

  return (
    <div className="space-y-8">
      {sections.map(({ type, title, icon: Icon, color }) => (
        <section key={type} className="space-y-4">
          <div className="flex items-center gap-2">
            <Icon className={`w-6 h-6 ${color}`} />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{title}</h2>
          </div>
          
          {sectionLoading[type] ? (
            <div className="text-center py-8">
              <div className="text-gray-600 dark:text-gray-400">Loading...</div>
            </div>
          ) : (
            <div className={`grid gap-4 sm:gap-6 ${
              type === 'book' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
            }`}>
              {sectionData[type].map((item: Recommendation) => (
                <RecommendationCard
                  key={item.id}
                  item={item}
                  type={type}
                  onViewDetails={() => openModal(item, type)}
                  onAddToFavorites={() => addToFavorites.mutate(item)}
                />
              ))}
            </div>
          )}
        </section>
      ))}

      <RecommendationModal
        isOpen={!!selectedItem}
        onClose={closeModal}
        item={selectedItem}
        type={selectedType}
        onAddToFavorites={handleAddToFavorites}
      />
    </div>
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
              className={`w-full object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-105 ${
                type === 'book' ? 'h-48 sm:h-64' : type === 'music' ? 'h-32 sm:h-40' : 'h-40 sm:h-48'
              }`}
              onError={(e) => {
                // Fallback to placeholder if image fails to load
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
              type === 'book' ? 'h-48 sm:h-64' : type === 'music' ? 'h-32 sm:h-40' : 'h-40 sm:h-48'
            } ${item.imageUrl ? 'hidden' : ''}`}
          >
            <div className="text-center text-gray-500 dark:text-gray-400">
              <div className="text-sm sm:text-lg font-semibold mb-1">{type.toUpperCase()}</div>
              <div className="text-xs sm:text-sm">No Image</div>
            </div>
          </div>
        </div>
        <div className="absolute top-2 right-2 flex gap-1">
          <Button
            size="sm"
            variant="secondary"
            className="bg-white/90 backdrop-blur-sm rounded-full p-1.5 sm:p-2 w-8 h-8 sm:w-10 sm:h-10 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              onAddToFavorites();
            }}
          >
            <Heart size={14} className="sm:w-4 sm:h-4 text-gray-600 hover:text-red-500" />
          </Button>
        </div>
      </div>
      
      <CardContent className="p-3 sm:p-4">
        <div className="space-y-2 sm:space-y-3">
          <div>
            <h3 className="font-medium text-sm sm:text-base text-gray-800 dark:text-gray-200 line-clamp-2 mb-1">
              {item.title}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2 sm:line-clamp-3">
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
            className="w-full text-xs sm:text-sm py-2"
            variant="outline"
          >
            <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">View Details</span>
            <span className="sm:hidden">Details</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}