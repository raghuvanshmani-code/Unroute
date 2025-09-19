'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

// Mock user data
const mockUser = {
  uid: 'mock-user-id',
  displayName: 'Valued User',
  email: 'user@example.com',
  photoURL: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
};

interface AuthContextType {
  user: typeof mockUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<typeof mockUser | null>(mockUser);
  const [loading, setLoading] = useState(false);

  const signInWithGoogle = async () => {
    console.log('signInWithGoogle called, but is mocked.');
    setLoading(true);
    // Simulate a sign-in
    setTimeout(() => {
        setUser(mockUser);
        setLoading(false);
    }, 500);
  };

  const logout = async () => {
    console.log('logout called, but is mocked.');
    // In a real app, you'd redirect. Here we just clear the user.
    setUser(null);
  };

  const value = { user, loading, signInWithGoogle, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
