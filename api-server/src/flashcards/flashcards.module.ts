import { Module } from '@nestjs/common';
import { FlashcardsService } from './flashcards.service';
import { FlashcardsController } from './flashcards.controller';
import { PrismaService } from '../prisma.service';
import { FsrsService } from '../fsrs.service';

@Module({
  controllers: [FlashcardsController],
  providers: [FlashcardsService, PrismaService, FsrsService],
})
export class FlashcardsModule { }
