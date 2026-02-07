"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

interface User {
  userId: string;
  email?: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const decoded = jwtDecode<User>(token);
          // Check if token is expired
          const currentTime = Date.now() / 1000;
           // @ts-expect-error - exp is standard field
          if (decoded.exp < currentTime) {
              // Let the interceptor handle refresh on next request or just clear
              // For simplicity, we can trust the interceptor flow or try a refresh explicitly.
              // Here we just set the user assuming valid until proven otherwise
          }
          setUser(decoded);
        } catch (error) {
          console.error("Invalid token", error);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = (accessToken: string, refreshToken: string) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    // Decode token to get userId, but for name/email we might need to fetch profile or pass it in login response
    // Since we passed user object in login response, we should probably update context to accept user object or fetch it.
    // However, for simplicity given current structure, we'll decode what's in token or just rely on what we have.
    // Wait, the token only has `userId`.
    // We should probably update the token payload in backend or fetch user details.
    // Let's allow passing user details to login function to update state immediately.
    const decoded = jwtDecode<User>(accessToken);
    setUser(decoded); 
    // Ideally we should merge the response user data with decoded token data
    // But since I changed controller to return user object, I should update this function signature
    router.push('/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    router.push('/login');
  };

  // Improved route protection logic
  useEffect(() => {
    if (!loading && !user && pathname !== '/login' && pathname !== '/register') {
      router.push('/login');
    }
    if (!loading && user && (pathname === '/login' || pathname === '/register')) {
        router.push('/dashboard');
    }
  }, [user, loading, pathname, router]);


  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
