import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserProfile } from '../types';

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (token: string, user: UserProfile) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const storedToken = localStorage.getItem('defensoria_token');
    const storedUser = localStorage.getItem('defensoria_user');
    
    if (storedToken && storedUser) {
      try {
        return {
          user: JSON.parse(storedUser),
          token: storedToken,
          isAuthenticated: true
        };
      } catch (e) {
        return { user: null, token: null, isAuthenticated: false };
      }
    }
    
    return { user: null, token: null, isAuthenticated: false };
  });

  const login = (token: string, user: UserProfile) => {
    localStorage.setItem('defensoria_token', token);
    localStorage.setItem('defensoria_user', JSON.stringify(user));
    setAuthState({ user, token, isAuthenticated: true });
  };

  const logout = () => {
    localStorage.removeItem('defensoria_token');
    localStorage.removeItem('defensoria_user');
    setAuthState({ user: null, token: null, isAuthenticated: false });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
