import React from 'react';
import { Progress } from '@/components/ui/progress';

interface LevelProgressProps {
    xp: number;
    level: number;
}

export function LevelProgress({ xp, level }: LevelProgressProps) {
    // Formula: Level = floor(sqrt(XP / 100)) + 1
    // XP for Level N = 100 * (N-1)^2
    const currentLevelBaseXp = 100 * Math.pow(level - 1, 2);
    const nextLevelBaseXp = 100 * Math.pow(level, 2);
    const xpNeededForNextLevel = nextLevelBaseXp - currentLevelBaseXp;
    const currentProgressXp = xp - currentLevelBaseXp;

    const progressPercent = Math.min(100, Math.max(0, (currentProgressXp / xpNeededForNextLevel) * 100));

    return (
        <div className="w-full space-y-2">
            <div className="flex justify-between items-end">
                <div>
                    <span className="text-sm text-muted-foreground">Level</span>
                    <div className="text-2xl font-bold text-primary">{level}</div>
                </div>
                <div className="text-right">
                    <span className="text-sm text-muted-foreground">{Math.floor(currentProgressXp)} / {xpNeededForNextLevel} XP</span>
                </div>
            </div>
            <Progress value={progressPercent} className="h-3" />
            <div className="text-xs text-center text-muted-foreground">
                {Math.ceil(nextLevelBaseXp - xp)} XP to Level {level + 1}
            </div>
        </div>
    );
}
