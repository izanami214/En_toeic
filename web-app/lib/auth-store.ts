import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Badge {
    id: string;
    code: string;
    name: string;
    description: string;
    icon: string;
    xpReward: number;
}

export interface UserBadge {
    id: string;
    userId: string;
    badgeId: string;
    earnedAt: string;
    badge: Badge;
}

export interface User {
    id: string;
    email: string;
    fullName: string | null;
    role: string;
    avatarUrl?: string | null;
    xp: number;
    level: number;
    streak: number;
    lastActivity?: string; // Date string
    badges?: UserBadge[];
}

interface AuthState {
    user: User | null;
    accessToken: string | null;
    login: (user: User, accessToken: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            login: (user, accessToken) => set({ user, accessToken, isAuthenticated: true }),
            logout: () => set({ user: null, accessToken: null, isAuthenticated: false }),
        }),
        {
            name: 'auth-storage', // name of the item in the storage (must be unique)
        }
    )
);
