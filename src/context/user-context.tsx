'use client';

import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';

type User = {
  name: string;
  email: string;
  avatar: string;
  role: 'admin' | 'auditor';
};

const UserContext = createContext<User | null>(null);

// This is a mock user. In a real application, you would fetch this
// from your authentication provider.
const mockUser: User = {
  name: 'X Bank Auditor',
  email: 'auditor@xbank.com',
  avatar: 'https://placehold.co/40x40.png',
  role: 'auditor', // Change to 'admin' to see all menu items
};

export function UserProvider({ children }: { children: ReactNode }) {
  return (
    <UserContext.Provider value={mockUser}>{children}</UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === null) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
