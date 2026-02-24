export interface Badge {
    id: string;
    code: string;
    name: string;
    description: string;
    icon: string;
    condition?: string;
}

export interface UserBadge {
    id: string;
    userId: string;
    badgeId: string;
    earnedAt: string; // Date string
    badge: Badge;
}

export interface LeaderboardUser {
    id: string;
    fullName: string | null;
    avatarUrl: string | null;
    xp: number;
    level: number;
    badges: UserBadge[];
}
