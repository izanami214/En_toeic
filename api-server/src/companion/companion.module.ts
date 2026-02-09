import { Module } from '@nestjs/common';
import { CompanionController } from './companion.controller';
import { CompanionService } from './companion.service';
import { LlmService } from './llm.service';
import { PrismaService } from '../prisma.service';

@Module({
    controllers: [CompanionController],
    providers: [CompanionService, LlmService, PrismaService],
    exports: [CompanionService],
})
export class CompanionModule { }
