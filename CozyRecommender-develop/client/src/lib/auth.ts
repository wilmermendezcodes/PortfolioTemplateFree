export interface User {
  id: string;
  username: string;
  preferences?: any;
  subscription?: string;
}

export const authStorage = {
  getUser(): User | null {
    try {
      const userData = localStorage.getItem('cozy_user');
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  },

  setUser(user: User): void {
    localStorage.setItem('cozy_user', JSON.stringify(user));
  },

  clearUser(): void {
    localStorage.removeItem('cozy_user');
  },

  isAuthenticated(): boolean {
    return this.getUser() !== null;
  }
};
