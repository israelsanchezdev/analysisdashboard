import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Mock user database stored in localStorage
function getMockUsers(): Array<{ id: string; name: string; email: string; password: string }> {
  try {
    return JSON.parse(localStorage.getItem('mock_users') || '[]');
  } catch {
    return [];
  }
}

function saveMockUser(user: { id: string; name: string; email: string; password: string }) {
  const users = getMockUsers();
  users.push(user);
  localStorage.setItem('mock_users', JSON.stringify(users));
}

function getFavatar(name: string) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=58a6ff&color=0d1117&bold=true`;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,

      login: async (email, password) => {
        await new Promise((r) => setTimeout(r, 400)); // simulate network
        const users = getMockUsers();
        const found = users.find((u) => u.email === email && u.password === password);
        if (!found) throw new Error('Invalid email or password');
        set({
          user: { id: found.id, name: found.name, email: found.email, avatar: getFavatar(found.name) },
        });
      },

      register: async (name, email, password) => {
        await new Promise((r) => setTimeout(r, 400));
        const users = getMockUsers();
        if (users.find((u) => u.email === email)) throw new Error('Email already registered');
        const newUser = { id: crypto.randomUUID(), name, email, password };
        saveMockUser(newUser);
        set({
          user: { id: newUser.id, name, email, avatar: getFavatar(name) },
        });
      },

      logout: () => set({ user: null }),
    }),
    { name: 'auth-storage', partialize: (s) => ({ user: s.user }) }
  )
);
