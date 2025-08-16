import React, { useState } from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useAuthStore } from '@/store/auth';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Palette, 
  Moon, 
  Sun, 
  Monitor,
  Settings,
  Save,
  Brain,
  Sparkles,
  Home,
  ArrowLeft
} from 'lucide-react';

interface Theme {
  id: string;
  name: string;
  description: string;
  preview: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
}

const AVAILABLE_THEMES: Theme[] = [
  {
    id: 'cozy',
    name: 'Cozy Original',
    description: 'Warm oranges and comfortable earth tones',
    preview: {
      primary: '#f97316', // Orange
      secondary: '#ea580c',
      accent: '#fed7aa',
      background: '#fff7ed'
    }
  },
  {
    id: 'forest',
    name: 'Forest Retreat',
    description: 'Calming greens and natural tones',
    preview: {
      primary: '#16a34a', // Green
      secondary: '#15803d',
      accent: '#bbf7d0',
      background: '#f0fdf4'
    }
  },
  {
    id: 'ocean',
    name: 'Ocean Breeze',
    description: 'Soothing blues and aqua tones',
    preview: {
      primary: '#0ea5e9', // Sky blue
      secondary: '#0284c7',
      accent: '#bae6fd',
      background: '#f0f9ff'
    }
  },
  {
    id: 'sunset',
    name: 'Sunset Glow',
    description: 'Warm pinks and purple gradients',
    preview: {
      primary: '#ec4899', // Pink
      secondary: '#db2777',
      accent: '#fbcfe8',
      background: '#fdf2f8'
    }
  },
  {
    id: 'minimal',
    name: 'Minimal Gray',
    description: 'Clean grays and subtle accents',
    preview: {
      primary: '#64748b', // Slate
      secondary: '#475569',
      accent: '#e2e8f0',
      background: '#f8fafc'
    }
  },
  {
    id: 'lavender',
    name: 'Lavender Dreams',
    description: 'Soft purples and dreamy tones',
    preview: {
      primary: '#8b5cf6', // Violet
      secondary: '#7c3aed',
      accent: '#ddd6fe',
      background: '#f5f3ff'
    }
  }
];

export default function Profile() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  
  // Theme state
  const [selectedTheme, setSelectedTheme] = useState('cozy');
  const [darkMode, setDarkMode] = useState(false);
  const [systemTheme, setSystemTheme] = useState(false);
  
  // Profile state
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [enablePersonalization, setEnablePersonalization] = useState(true);
  const [enableNotifications, setEnableNotifications] = useState(false);

  const applyTheme = (themeId: string) => {
    const theme = AVAILABLE_THEMES.find(t => t.id === themeId);
    if (!theme) return;

    // Store theme preference in localStorage for persistence
    localStorage.setItem('selectedTheme', themeId);
    
    setSelectedTheme(themeId);
    
    toast({
      title: `${theme.name} theme applied!`,
      description: "Theme will be applied on next page reload or app restart.",
    });
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    if (!systemTheme) {
      localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
    }
    
    toast({
      title: newDarkMode ? 'Dark mode enabled' : 'Light mode enabled',
      description: `Switched to ${newDarkMode ? 'dark' : 'light'} mode.`,
    });
  };

  const toggleSystemTheme = () => {
    const newSystemTheme = !systemTheme;
    setSystemTheme(newSystemTheme);
    
    if (newSystemTheme) {
      // Follow system preference
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(isDark);
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('theme', 'system');
    }
    
    toast({
      title: newSystemTheme ? 'System theme enabled' : 'System theme disabled',
      description: newSystemTheme 
        ? 'Theme will now follow your system settings.' 
        : 'You can now manually control the theme.',
    });
  };

  const saveSettings = () => {
    // In a real app, this would save to backend
    localStorage.setItem('selectedTheme', selectedTheme);
    localStorage.setItem('enablePersonalization', enablePersonalization.toString());
    localStorage.setItem('enableNotifications', enableNotifications.toString());
    
    toast({
      title: "Settings saved!",
      description: "Your preferences have been updated successfully.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header with Home Link */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard">
            <Button variant="outline" size="sm" className="flex items-center space-x-2">
              <ArrowLeft className="w-4 h-4" />
              <Home className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Button>
          </Link>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Profile & Settings</h1>
        <div></div>
      </div>
      
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile & Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-white">G</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold">Guest User</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Anonymous exploration mode - no personal data collected
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Theme Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Theme & Appearance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Dark Mode Controls */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Dark Mode</Label>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Toggle between light and dark appearance
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Sun className="h-4 w-4" />
                <Switch 
                  checked={darkMode} 
                  onCheckedChange={toggleDarkMode}
                  disabled={systemTheme}
                />
                <Moon className="h-4 w-4" />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Follow System Theme</Label>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Automatically switch based on your device settings
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Monitor className="h-4 w-4" />
                <Switch 
                  checked={systemTheme} 
                  onCheckedChange={toggleSystemTheme}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Theme Selection */}
          <div className="space-y-4">
            <Label className="text-base">Color Theme</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {AVAILABLE_THEMES.map((theme) => (
                <Card 
                  key={theme.id} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedTheme === theme.id 
                      ? 'ring-2 ring-primary shadow-md' 
                      : 'hover:shadow-lg'
                  }`}
                  onClick={() => setSelectedTheme(theme.id)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* Theme Preview */}
                      <div className="flex space-x-2 h-8">
                        <div 
                          className="flex-1 rounded"
                          style={{ backgroundColor: theme.preview.primary }}
                        />
                        <div 
                          className="flex-1 rounded"
                          style={{ backgroundColor: theme.preview.secondary }}
                        />
                        <div 
                          className="flex-1 rounded"
                          style={{ backgroundColor: theme.preview.accent }}
                        />
                      </div>
                      
                      <div>
                        <h4 className="font-medium">{theme.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {theme.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="flex justify-center mt-6">
              <Button onClick={() => applyTheme(selectedTheme)} className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Apply Theme
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personalization Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Personalization
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Enhanced Recommendations</Label>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Use psychological profiling for better suggestions
              </div>
            </div>
            <Switch 
              checked={enablePersonalization} 
              onCheckedChange={setEnablePersonalization}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Recommendation Notifications</Label>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Get notified about new recommendations (development mode)
              </div>
            </div>
            <Switch 
              checked={enableNotifications} 
              onCheckedChange={setEnableNotifications}
            />
          </div>
        </CardContent>
      </Card>

      {/* Advanced Settings */}
      <Card>
        <CardHeader>
          <CardTitle 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
          >
            <Settings className="w-5 h-5" />
            Advanced Settings
            <Sparkles className={`w-4 h-4 transition-transform ${
              showAdvancedSettings ? 'rotate-180' : ''
            }`} />
          </CardTitle>
        </CardHeader>
        {showAdvancedSettings && (
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                Development Environment
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                This is a development version of Cozy. All data is stored locally 
                and no personal information is collected or transmitted.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label>Data Storage</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                All preferences and settings are stored locally in your browser. 
                No data is sent to external servers.
              </p>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Save Button */}
      <div className="flex justify-between">
        <Link href="/dashboard">
          <Button variant="outline" className="flex items-center gap-2">
            <Home className="w-4 h-4" />
            Return to Dashboard
          </Button>
        </Link>
        <Button onClick={saveSettings} className="flex items-center gap-2">
          <Save className="w-4 h-4" />
          Save All Settings
        </Button>
      </div>
    </div>
  );
}