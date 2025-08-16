import { Button } from "@/components/ui/button";
import { useRecommendationStore, type Mood } from "@/store/recommendations";
import { cn } from "@/lib/utils";

const moods: Array<{ id: Mood; emoji: string; label: string; color: string }> = [
  { id: 'relaxed', emoji: '🧘‍♀️', label: 'Relaxed', color: 'hover:border-primary hover:bg-surface' },
  { id: 'energetic', emoji: '⚡', label: 'Energetic', color: 'hover:border-secondary hover:bg-blue-50' },
  { id: 'creative', emoji: '🎨', label: 'Creative', color: 'hover:border-accent hover:bg-yellow-50' },
  { id: 'nostalgic', emoji: '🌅', label: 'Nostalgic', color: 'hover:border-success hover:bg-green-50' },
];

export default function MoodSelector() {
  const { selectedMood, setMood, clearPreferences } = useRecommendationStore();

  const handleMoodSelect = (mood: Mood) => {
    clearPreferences(); // Clear any existing detailed preferences
    setMood(mood);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">How are you feeling today?</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {moods.map((mood) => (
          <Button
            key={mood.id}
            variant="outline"
            onClick={() => handleMoodSelect(mood.id)}
            className={cn(
              "p-4 h-auto flex flex-col items-center space-y-2 border-2 transition-all duration-200 group",
              mood.color,
              selectedMood === mood.id 
                ? "border-primary bg-surface" 
                : "border-gray-200"
            )}
          >
            <div className="text-2xl">{mood.emoji}</div>
            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-800">
              {mood.label}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
}
