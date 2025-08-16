import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { useRecommendationStore, type Mood } from "@/store/recommendations";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface PreferencesTriageProps {
  mood: Mood;
  onComplete: (preferences: RecommendationPreferences) => void;
  onBack: () => void;
}

export interface RecommendationPreferences {
  timeAvailable: string;
  setting: string;
  intensity: number;
  genres: string[];
  ageRating: string;
  previousExperience: string;
  currentGoal: string;
}

export default function PreferencesTriage({ mood, onComplete, onBack }: PreferencesTriageProps) {
  const [step, setStep] = useState(1);
  const [preferences, setPreferences] = useState<RecommendationPreferences>({
    timeAvailable: "",
    setting: "",
    intensity: 5,
    genres: [],
    ageRating: "",
    previousExperience: "",
    currentGoal: ""
  });

  const totalSteps = 4;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onComplete(preferences);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      onBack();
    }
  };

  const updatePreferences = (key: keyof RecommendationPreferences, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const toggleGenre = (genre: string) => {
    setPreferences(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre]
    }));
  };

  const getMoodEmoji = (mood: Mood) => {
    const moodEmojis = {
      relaxed: '🧘‍♀️',
      energetic: '⚡',
      creative: '🎨',
      nostalgic: '🌅'
    };
    return moodEmojis[mood];
  };

  const getGenresByMood = (mood: Mood) => {
    const genreMap = {
      relaxed: ['Drama', 'Romance', 'Documentary', 'Self-Help', 'Ambient', 'Classical'],
      energetic: ['Action', 'Adventure', 'Thriller', 'Fitness', 'Electronic', 'Rock'],
      creative: ['Fantasy', 'Sci-Fi', 'Art & Design', 'Biography', 'Indie', 'Jazz'],
      nostalgic: ['Classic', 'Historical', 'Family', 'Memoir', 'Oldies', 'Country']
    };
    return genreMap[mood];
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span>{getMoodEmoji(mood)}</span>
            <span>Tell us more about your {mood} mood</span>
          </div>
          <span className="text-sm text-gray-500">
            Step {step} of {totalSteps}
          </span>
        </CardTitle>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="font-medium">How much time do you have?</h3>
            <RadioGroup 
              value={preferences.timeAvailable} 
              onValueChange={(value) => updatePreferences('timeAvailable', value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="quick" id="quick" />
                <Label htmlFor="quick">Quick (15-30 minutes)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="medium" />
                <Label htmlFor="medium">Medium (1-2 hours)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="long" id="long" />
                <Label htmlFor="long">Extended (2+ hours or multiple sessions)</Label>
              </div>
            </RadioGroup>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="font-medium">What's your current setting?</h3>
            <RadioGroup 
              value={preferences.setting} 
              onValueChange={(value) => updatePreferences('setting', value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="alone" id="alone" />
                <Label htmlFor="alone">Enjoying alone time</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="friends" id="friends" />
                <Label htmlFor="friends">With friends or family</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="partner" id="partner" />
                <Label htmlFor="partner">With partner/significant other</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="background" id="background" />
                <Label htmlFor="background">Background while doing other activities</Label>
              </div>
            </RadioGroup>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-medium">How intense should the experience be?</h3>
              <div className="px-4">
                <Slider
                  value={[preferences.intensity]}
                  onValueChange={(value) => updatePreferences('intensity', value[0])}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>Light & Easy</span>
                  <span>Moderate</span>
                  <span>Deep & Intense</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Preferred genres/styles:</h3>
              <div className="grid grid-cols-2 gap-3">
                {getGenresByMood(mood).map((genre) => (
                  <div key={genre} className="flex items-center space-x-2">
                    <Checkbox
                      id={genre}
                      checked={preferences.genres.includes(genre)}
                      onCheckedChange={() => toggleGenre(genre)}
                    />
                    <Label htmlFor={genre} className="text-sm">{genre}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-medium">What's your main goal right now?</h3>
              <RadioGroup 
                value={preferences.currentGoal} 
                onValueChange={(value) => updatePreferences('currentGoal', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="escape" id="escape" />
                  <Label htmlFor="escape">Escape and unwind</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="learn" id="learn" />
                  <Label htmlFor="learn">Learn something new</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="inspire" id="inspire" />
                  <Label htmlFor="inspire">Get inspired or motivated</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="connect" id="connect" />
                  <Label htmlFor="connect">Connect with emotions</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="entertain" id="entertain" />
                  <Label htmlFor="entertain">Pure entertainment</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">How familiar are you with this type of content?</h3>
              <RadioGroup 
                value={preferences.previousExperience} 
                onValueChange={(value) => updatePreferences('previousExperience', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="beginner" id="beginner" />
                  <Label htmlFor="beginner">New to this - show me the basics</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="intermediate" id="intermediate" />
                  <Label htmlFor="intermediate">Some experience - mix of popular and unique</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="expert" id="expert" />
                  <Label htmlFor="expert">Very experienced - surprise me with hidden gems</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        )}

        <div className="flex justify-between pt-6">
          <Button
            variant="outline"
            onClick={handlePrevious}
            className="flex items-center space-x-2"
          >
            <ChevronLeft size={16} />
            <span>Previous</span>
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={
              (step === 1 && !preferences.timeAvailable) ||
              (step === 2 && !preferences.setting) ||
              (step === 4 && (!preferences.currentGoal || !preferences.previousExperience))
            }
            className="flex items-center space-x-2"
          >
            <span>{step === totalSteps ? 'Get Recommendations' : 'Next'}</span>
            <ChevronRight size={16} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}