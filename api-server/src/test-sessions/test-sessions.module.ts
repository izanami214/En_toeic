import { Module } from '@nestjs/common';
import { TestSessionsService } from './test-sessions.service';
import { TestSessionsController } from './test-sessions.controller';
import { PrismaService } from '../prisma.service';
import { GamificationModule } from '../gamification/gamification.module';

@Module({
    imports: [GamificationModule],
    controllers: [TestSessionsController],
    providers: [TestSessionsService, PrismaService],
})
export class TestSessionsModule { }
