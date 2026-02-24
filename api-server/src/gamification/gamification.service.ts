import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class GamificationService {
    constructor(private prisma: PrismaService) { }

    // Calculate level based on XP: Level = floor(sqrt(XP / 100)) + 1
    // XP needed for level N: 100 * (N-1)^2
    calculateLevel(xp: number): number {
        return Math.floor(Math.sqrt(xp / 100)) + 1;
    }

    async addXp(userId: string, amount: number, source: string): Promise<any> {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) return null;

        const newXp = user.xp + amount;
        const newLevel = this.calculateLevel(newXp);
        let levelUp = false;

        if (newLevel > user.level) {
            levelUp = true;
            // TODO: Handle level up notification or reward
        }

        // Update user
        const updatedUser = await this.prisma.user.update({
            where: { id: userId },
            data: {
                xp: newXp,
                level: newLevel,
                lastActivity: new Date(),
            },
        });

        return {
            success: true,
            xpAdded: amount,
            newTotalXp: newXp,
            level: newLevel,
            levelUp,
            source,
        };
    }

    async checkBadges(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { badges: true, testSessions: true },
        });

        if (!user) return;

        // 1. First Test
        if (user.testSessions.length > 0) {
            await this.awardBadge(userId, 'FIRST_TEST');
        }

        // 2. High Scorer (Score > 450 in any test)
        const hasHighScore = user.testSessions.some(s => (s.score || 0) >= 450);
        if (hasHighScore) {
            await this.awardBadge(userId, 'HIGH_SCORER');
        }

        // 3. Level Milestones
        if (user.level >= 5) {
            await this.awardBadge(userId, 'LEVEL_5');
        }
        if (user.level >= 10) {
            await this.awardBadge(userId, 'LEVEL_10');
        }

        // 4. Streak Milestones
        if (user.streak >= 3) {
            await this.awardBadge(userId, 'STREAK_3');
        }
        if (user.streak >= 7) {
            await this.awardBadge(userId, 'STREAK_7');
        }
    }

    private async awardBadge(userId: string, badgeCode: string) {
        const badge = await this.prisma.badge.findUnique({ where: { code: badgeCode } });
        if (!badge) return;

        // Check if already owned
        const existing = await this.prisma.userBadge.findUnique({
            where: {
                userId_badgeId: { userId, badgeId: badge.id }
            }
        });

        if (!existing) {
            await this.prisma.userBadge.create({
                data: {
                    userId,
                    badgeId: badge.id
                }
            });
            // Award XP for badge if any
            if (badge.xpReward > 0) {
                await this.addXp(userId, badge.xpReward, `Badge: ${badge.name}`);
            }
        }
    }

    async getLeaderboard(limit = 10) {
        return this.prisma.user.findMany({
            take: limit,
            orderBy: { xp: 'desc' },
            select: {
                id: true,
                fullName: true,
                avatarUrl: true,
                xp: true,
                level: true,
                badges: {
                    take: 3,
                    include: { badge: true }
                }
            },
        });
    }
}
