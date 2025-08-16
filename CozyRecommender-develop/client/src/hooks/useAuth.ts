import { useAuthStore } from "@/store/auth";

export const useAuth = () => {
  const { user, isAuthenticated, isLoading, login, logout } = useAuthStore();

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };
};
