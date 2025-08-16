import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuthStore } from "@/store/auth";

interface GenerateRecommendationsParams {
  type: 'movie' | 'book' | 'music';
  mood?: string;
}

export const usePuterAI = () => {
  const { user } = useAuthStore();

  const generateRecommendations = useMutation({
    mutationFn: async ({ type, mood }: GenerateRecommendationsParams) => {
      if (!user) throw new Error('User not authenticated');
      
      const response = await apiRequest('POST', '/api/ai/recommendations', {
        userId: user.id,
        type,
        mood: mood || 'relaxed'
      });
      
      return response.json();
    },
  });

  return {
    generateRecommendations: generateRecommendations.mutate,
    isGenerating: generateRecommendations.isPending,
    error: generateRecommendations.error,
  };
};
