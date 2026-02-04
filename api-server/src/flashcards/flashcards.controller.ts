import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { FlashcardsService } from './flashcards.service';
import { Rating } from '../fsrs.service';

@Controller('flashcards')
export class FlashcardsController {
  constructor(private readonly flashcardsService: FlashcardsService) { }

  @Get('due')
  getDueCards(@Query('userId') userId: string) {
    return this.flashcardsService.getDueCards(userId);
  }

  @Post(':userId/review')
  reviewFlashcard(
    @Param('userId') userId: string,
    @Body() reviewDto: { flashcardId: string; rating: number },
  ) {
    return this.flashcardsService.reviewCard(
      userId,
      reviewDto.flashcardId,
      reviewDto.rating,
    );
  }

  @Get('all')
  getAllFlashcards() {
    return this.flashcardsService.getAllFlashcards();
  }

  @Post(':userId/learn')
  learnNewCards(
    @Param('userId') userId: string,
    @Body() body: { count?: number },
  ) {
    return this.flashcardsService.learnNewCards(userId, body.count);
  }

  @Get('stats')
  getStats(@Query('userId') userId: string) {
    return this.flashcardsService.getStats(userId);
  }
}
