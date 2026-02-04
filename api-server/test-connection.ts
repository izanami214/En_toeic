import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

async function main() {
    try {
        console.log('Testing connection...');
        const result = await prisma.$queryRaw`SELECT version()`;
        console.log('✅ Connection successful!');
        console.log('PostgreSQL version:', result);
    } catch (error) {
        console.error('❌ Connection failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
