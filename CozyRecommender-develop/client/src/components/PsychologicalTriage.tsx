import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Brain, ChevronRight, ChevronLeft } from 'lucide-react';

interface TriageQuestion {
  id: string;
  question: string;
  category: 'emotional' | 'energy' | 'social' | 'cognitive' | 'lifestyle';
  options: Array<{
    value: string;
    label: string;
    weight: Record<string, number>; // mood weights
  }>;
}

const TRIAGE_QUESTIONS: TriageQuestion[] = [
  {
    id: 'current_emotion',
    category: 'emotional',
    question: 'How would you describe your current emotional state?',
    options: [
      { value: 'overwhelmed', label: 'Feeling overwhelmed or stressed', weight: { relaxed: 3, creative: 1 } },
      { value: 'content', label: 'Calm and content', weight: { relaxed: 3, nostalgic: 2 } },
      { value: 'excited', label: 'Excited and enthusiastic', weight: { energetic: 3, creative: 2 } },
      { value: 'reflective', label: 'Thoughtful and reflective', weight: { nostalgic: 3, creative: 2 } },
      { value: 'restless', label: 'Restless and need stimulation', weight: { energetic: 3 } }
    ]
  },
  {
    id: 'energy_level',
    category: 'energy',
    question: 'What is your current energy level?',
    options: [
      { value: 'very_low', label: 'Very low - I need gentle, soothing content', weight: { relaxed: 3 } },
      { value: 'low', label: 'Low - I want something calming but engaging', weight: { relaxed: 2, nostalgic: 1 } },
      { value: 'moderate', label: 'Moderate - I\'m open to various experiences', weight: { creative: 2, nostalgic: 1, relaxed: 1 } },
      { value: 'high', label: 'High - I want something dynamic and engaging', weight: { energetic: 2, creative: 1 } },
      { value: 'very_high', label: 'Very high - I need intense, stimulating content', weight: { energetic: 3 } }
    ]
  },
  {
    id: 'social_preference',
    category: 'social',
    question: 'How do you prefer to experience entertainment right now?',
    options: [
      { value: 'alone', label: 'Alone - I want personal, introspective content', weight: { relaxed: 2, nostalgic: 2 } },
      { value: 'intimate', label: 'In a small, intimate setting', weight: { nostalgic: 2, creative: 1 } },
      { value: 'social', label: 'With others - something we can enjoy together', weight: { energetic: 2 } },
      { value: 'background', label: 'As background while doing other activities', weight: { relaxed: 3 } }
    ]
  },
  {
    id: 'mental_state',
    category: 'cognitive',
    question: 'How much mental engagement do you want right now?',
    options: [
      { value: 'minimal', label: 'Minimal - I want to zone out and relax', weight: { relaxed: 3 } },
      { value: 'light', label: 'Light - Something easy to follow', weight: { relaxed: 2, nostalgic: 1 } },
      { value: 'moderate', label: 'Moderate - I enjoy some complexity', weight: { creative: 2, nostalgic: 1 } },
      { value: 'high', label: 'High - I want something challenging or thought-provoking', weight: { creative: 3 } },
      { value: 'stimulating', label: 'Very stimulating - I want my mind fully engaged', weight: { creative: 2, energetic: 1 } }
    ]
  },
  {
    id: 'life_context',
    category: 'lifestyle',
    question: 'What best describes your current life situation?',
    options: [
      { value: 'stressful', label: 'Going through a stressful period', weight: { relaxed: 3 } },
      { value: 'transitional', label: 'In a period of change or transition', weight: { creative: 2, nostalgic: 1 } },
      { value: 'celebratory', label: 'Celebrating or in a positive phase', weight: { energetic: 3 } },
      { value: 'routine', label: 'In a comfortable routine', weight: { relaxed: 2, nostalgic: 2 } },
      { value: 'seeking_inspiration', label: 'Looking for inspiration or motivation', weight: { creative: 3, energetic: 1 } }
    ]
  },
  {
    id: 'time_availability',
    category: 'lifestyle',
    question: 'How much time do you have available?',
    options: [
      { value: 'short', label: 'Short burst (15-30 minutes)', weight: { energetic: 1, relaxed: 1 } },
      { value: 'moderate', label: 'Moderate time (30-90 minutes)', weight: { creative: 1, nostalgic: 1 } },
      { value: 'extended', label: 'Extended period (2+ hours)', weight: { creative: 2, nostalgic: 2 } },
      { value: 'flexible', label: 'Flexible - I can adjust as needed', weight: { relaxed: 1, creative: 1 } }
    ]
  },
  {
    id: 'mood_goal',
    category: 'emotional',
    question: 'What would you like to feel after this entertainment experience?',
    options: [
      { value: 'relaxed', label: 'More relaxed and peaceful', weight: { relaxed: 3 } },
      { value: 'energized', label: 'More energized and motivated', weight: { energetic: 3 } },
      { value: 'inspired', label: 'More creative and inspired', weight: { creative: 3 } },
      { value: 'connected', label: 'More connected to memories or emotions', weight: { nostalgic: 3 } },
      { value: 'balanced', label: 'More balanced and centered', weight: { relaxed: 2, creative: 1 } }
    ]
  }
];

interface TriageResults {
  primaryMood: string;
  secondaryMood?: string;
  confidence: number;
  insights: string[];
}

export default function PsychologicalTriage({ onComplete }: { onComplete: (results: TriageResults) => void }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isComplete, setIsComplete] = useState(false);

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const goToNext = () => {
    if (currentQuestion < TRIAGE_QUESTIONS.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      completeAssessment();
    }
  };

  const goToPrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const completeAssessment = () => {
    const moodScores: Record<string, number> = {
      relaxed: 0,
      energetic: 0,
      creative: 0,
      nostalgic: 0
    };

    // Calculate mood scores based on answers
    Object.entries(answers).forEach(([questionId, answerValue]) => {
      const question = TRIAGE_QUESTIONS.find(q => q.id === questionId);
      const option = question?.options.find(o => o.value === answerValue);
      
      if (option) {
        Object.entries(option.weight).forEach(([mood, weight]) => {
          moodScores[mood] += weight;
        });
      }
    });

    // Find primary and secondary moods
    const sortedMoods = Object.entries(moodScores)
      .sort(([,a], [,b]) => b - a);
    
    const primaryMood = sortedMoods[0][0];
    const secondaryMood = sortedMoods[1][1] > 0 ? sortedMoods[1][0] : undefined;
    
    // Calculate confidence based on score distribution
    const totalScore = Object.values(moodScores).reduce((sum, score) => sum + score, 0);
    const confidence = totalScore > 0 ? (sortedMoods[0][1] / totalScore) * 100 : 0;

    // Generate insights based on answers
    const insights = generateInsights(answers, primaryMood, confidence);

    const results: TriageResults = {
      primaryMood,
      secondaryMood,
      confidence: Math.round(confidence),
      insights
    };

    setIsComplete(true);
    onComplete(results);
  };

  const generateInsights = (answers: Record<string, string>, primaryMood: string, confidence: number): string[] => {
    const insights: string[] = [];
    
    // Emotional insights
    if (answers.current_emotion === 'overwhelmed') {
      insights.push("You're experiencing stress - gentle, calming content will help restore balance.");
    }
    
    if (answers.energy_level === 'very_low' && primaryMood === 'relaxed') {
      insights.push("Your low energy suggests you need restorative content to recharge.");
    }
    
    if (answers.mental_state === 'high' && primaryMood === 'creative') {
      insights.push("You're seeking intellectual stimulation - complex, thought-provoking content will satisfy your curiosity.");
    }
    
    if (answers.mood_goal === 'inspired' && primaryMood === 'creative') {
      insights.push("Your goal for inspiration aligns perfectly with creative content that can spark new ideas.");
    }
    
    if (confidence < 50) {
      insights.push("Your responses suggest you might benefit from a mix of different content types.");
    }
    
    // Lifestyle-based insights
    if (answers.life_context === 'transitional') {
      insights.push("During times of change, both inspiring and nostalgic content can provide comfort and direction.");
    }

    return insights;
  };

  const progress = ((currentQuestion + 1) / TRIAGE_QUESTIONS.length) * 100;
  const question = TRIAGE_QUESTIONS[currentQuestion];
  const currentAnswer = answers[question.id];

  if (isComplete) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-semibold mb-4">Assessment Complete!</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Your personalized recommendations are being generated based on your psychological profile.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>Question {currentQuestion + 1} of {TRIAGE_QUESTIONS.length}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            Personalized Recommendation Assessment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">{question.question}</h3>
            
            <RadioGroup 
              value={currentAnswer || ''} 
              onValueChange={(value) => handleAnswer(question.id, value)}
              className="space-y-3"
            >
              {question.options.map((option) => (
                <div key={option.value} className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <RadioGroupItem value={option.value} id={option.value} className="mt-0.5 flex-shrink-0" />
                  <Label 
                    htmlFor={option.value} 
                    className="flex-1 cursor-pointer text-sm leading-relaxed"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="flex justify-between pt-4">
            <Button 
              variant="outline" 
              onClick={goToPrevious}
              disabled={currentQuestion === 0}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            
            <Button 
              onClick={goToNext}
              disabled={!currentAnswer}
              className="flex items-center gap-2"
            >
              {currentQuestion === TRIAGE_QUESTIONS.length - 1 ? 'Complete Assessment' : 'Next'}
              {currentQuestion !== TRIAGE_QUESTIONS.length - 1 && <ChevronRight className="w-4 h-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}