import { create } from 'zustand';
import { authStorage, type User } from '@/lib/auth';
import { apiRequest } from '@/lib/queryClient';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string) => Promise<void>;
  logout: () => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (username: string) => {
    set({ isLoading: true });
    try {
      // Try API login first
      try {
        const response = await apiRequest('POST', '/api/auth/login', { username });
        const { user } = await response.json();
        
        authStorage.setUser(user);
        set({ user, isAuthenticated: true, isLoading: false });
        return;
      } catch (apiError) {
        console.warn('API login failed, using offline mode:', apiError);
      }
      
      // Fallback: Create user locally for demo purposes
      const user = {
        id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        username: username,
        preferences: {},
        subscription: 'free'
      };
      
      authStorage.setUser(user);
      set({ user, isAuthenticated: true, isLoading: false });
      
    } catch (error) {
      console.error('Login failed completely:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    authStorage.clearUser();
    set({ user: null, isAuthenticated: false });
    // Navigate to landing page
    window.location.href = '/';
  },

  initializeAuth: () => {
    const user = authStorage.getUser();
    // Check if user has old structure and clear if needed
    if (user && !user.username) {
      authStorage.clearUser();
      set({ user: null, isAuthenticated: false });
      return;
    }
    if (user) {
      set({ user, isAuthenticated: true });
    }
    // Don't auto-login - let users see the landing page first
  },
}));
