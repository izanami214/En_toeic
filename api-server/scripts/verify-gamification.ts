import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Verifying Prisma Client update...');

    // 1. Check if we can select new fields
    try {
        const user = await prisma.user.findFirst({
            select: {
                id: true,
                xp: true,
                level: true,
                streak: true
            }
        });
        console.log('Successfully selected gamification fields:', user);
    } catch (error) {
        console.error('Error selecting fields (Prisma Client might be outdated):', error);
        process.exit(1);
    }

    // 2. Check if Badge model has xpReward
    try {
        const badge = await prisma.badge.findFirst({
            select: {
                xpReward: true
            }
        });
        console.log('Successfully selected Badge.xpReward');
    } catch (error) {
        console.error('Error selecting Badge.xpReward:', error);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
