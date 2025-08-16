import { create } from 'zustand';

export type Mood = 'relaxed' | 'energetic' | 'creative' | 'nostalgic';
export type RecommendationType = 'movie' | 'book' | 'music';

export interface DetailedPreferences {
  timeAvailable?: string;
  setting?: string;
  intensity?: number;
  genres?: string[];
  ageRating?: string;
  previousExperience?: string;
  currentGoal?: string;
  // Psychological triage results
  primaryMood?: string;
  secondaryMood?: string;
  confidence?: number;
  insights?: string[];
}

interface RecommendationState {
  selectedMood: Mood | null;
  showTriage: boolean;
  detailedPreferences: DetailedPreferences | null;
  setMood: (mood: Mood) => void;
  setShowTriage: (show: boolean) => void;
  setDetailedPreferences: (preferences: DetailedPreferences) => void;
  clearPreferences: () => void;
  getCurrentTimeGreeting: () => string;
  getCurrentWeather: () => string;
}

export const useRecommendationStore = create<RecommendationState>((set, get) => ({
  selectedMood: null,
  showTriage: false,
  detailedPreferences: null,

  setMood: (mood: Mood) => {
    set({ selectedMood: mood, showTriage: false });
  },

  setShowTriage: (show: boolean) => {
    set({ showTriage: show });
  },

  setDetailedPreferences: (preferences: DetailedPreferences) => {
    set({ detailedPreferences: preferences, showTriage: false });
  },

  clearPreferences: () => {
    set({ selectedMood: null, showTriage: false, detailedPreferences: null });
  },

  getCurrentTimeGreeting: () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  },

  getCurrentWeather: () => {
    // Mock weather - in a real app, this would come from a weather API
    const conditions = ['Sunny, 72°F', 'Partly cloudy, 68°F', 'Clear, 75°F', 'Warm, 78°F'];
    return conditions[Math.floor(Math.random() * conditions.length)];
  },
}));
