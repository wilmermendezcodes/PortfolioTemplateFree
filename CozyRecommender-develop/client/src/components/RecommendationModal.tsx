import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Star } from "lucide-react";

interface RecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: any;
  type: 'movie' | 'book' | 'music';
  onAddToFavorites: () => void;
}

export function RecommendationModal({ isOpen, onClose, item, type, onAddToFavorites }: RecommendationModalProps) {
  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {item.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Image */}
          <div className="relative overflow-hidden rounded-lg">
            {item.imageUrl ? (
              <img 
                src={item.imageUrl} 
                alt={item.title}
                className="w-full h-64 object-cover transition-transform duration-300"
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
              className={`w-full h-64 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg ${
                item.imageUrl ? 'hidden' : ''
              }`}
            >
              <div className="text-center text-gray-500 dark:text-gray-400">
                <div className="text-lg font-semibold mb-1">{type.toUpperCase()}</div>
                <div className="text-sm">No Image</div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Description</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100">Details</h4>
              
              {type === 'movie' && item.metadata && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Genre:</span>
                    <span className="text-gray-800 dark:text-gray-200">{item.metadata.genre}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                    <span className="text-gray-800 dark:text-gray-200">{item.metadata.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Director:</span>
                    <span className="text-gray-800 dark:text-gray-200">{item.metadata.director}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Year:</span>
                    <span className="text-gray-800 dark:text-gray-200">{item.metadata.year}</span>
                  </div>
                </>
              )}

              {type === 'book' && item.metadata && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Author:</span>
                    <span className="text-gray-800 dark:text-gray-200">{item.metadata.author}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Pages:</span>
                    <span className="text-gray-800 dark:text-gray-200">{item.metadata.pages} pages</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Genre:</span>
                    <span className="text-gray-800 dark:text-gray-200">{item.metadata.genre}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Publisher:</span>
                    <span className="text-gray-800 dark:text-gray-200">{item.metadata.publisher}</span>
                  </div>
                </>
              )}

              {type === 'music' && item.metadata && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Artist:</span>
                    <span className="text-gray-800 dark:text-gray-200">{item.metadata.artist}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                    <span className="text-gray-800 dark:text-gray-200">{item.metadata.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Tracks:</span>
                    <span className="text-gray-800 dark:text-gray-200">{item.metadata.tracks} tracks</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Label:</span>
                    <span className="text-gray-800 dark:text-gray-200">{item.metadata.label}</span>
                  </div>
                </>
              )}
            </div>

            <div className="space-y-3">
              <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100">Reviews & Rating</h4>
              
              {item.metadata?.rating && (
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-gray-800 dark:text-gray-200 font-medium">
                    {item.metadata.rating}/{type === 'book' ? '5' : '10'}
                  </span>
                </div>
              )}

              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400 block mb-1">Critic Review:</span>
                  <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                    "{item.metadata?.criticReview}"
                  </p>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400 block mb-1">AI Review:</span>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {item.metadata?.aiReview}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Themes */}
          {item.metadata?.themes && (
            <div>
              <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-2">Themes</h4>
              <div className="flex flex-wrap gap-2">
                {item.metadata.themes.map((theme: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-sm">
                    {theme}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button 
              onClick={onAddToFavorites}
              className="flex-1"
              variant="outline"
            >
              <Heart className="w-4 h-4 mr-2" />
              Add to Favorites
            </Button>
            <Button 
              onClick={onClose}
              className="flex-1"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}