import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { FsrsService, Rating } from '../fsrs.service';
import { CardState } from '@prisma/client';

// Helper function to convert CardState to number for FSRS
function cardStateToNumber(state: CardState): number {
  const map: Record<CardState, number> = {
    NEW: 0,
    LEARNING: 1,
    REVIEW: 2,
    RELEARNING: 3,
  };
  return map[state];
}

// Helper function to convert number to CardState
function numberToCardState(state: number): CardState {
  const map = [CardState.NEW, CardState.LEARNING, CardState.REVIEW, CardState.RELEARNING];
  return map[state];
}

@Injectable()
export class FlashcardsService {
  constructor(
    private prisma: PrismaService,
    private fsrs: FsrsService,
  ) { }

  /**
   * Get flashcards due for review for a specific user
   */
  async getDueCards(userId: string) {
    const now = new Date();

    const dueCards = await this.prisma.userFlashcard.findMany({
      where: {
        userId,
        due: {
          lte: now,
        },
      },
      include: {
        flashcard: true,
      },
      orderBy: {
        due: 'asc',
      },
      take: 20, // Limit to 20 cards per session
    });

    return dueCards;
  }

  /**
   * Submit a review for a flashcard
   */
  async reviewCard(userId: string, flashcardId: string, rating: Rating) {
    const userCard = await this.prisma.userFlashcard.findFirst({
      where: {
        userId,
        flashcardId,
      },
    });

    if (!userCard) {
      throw new Error('Card not found');
    }

    // Use FSRS to calculate next schedule
    const updatedCard = this.fsrs.scheduleCard(
      {
        state: cardStateToNumber(userCard.state),
        stability: userCard.stability,
        difficulty: userCard.difficulty,
        due: userCard.due,
        lastReview: userCard.lastReview,
      },
      rating,
    );

    // Update the card
    await this.prisma.userFlashcard.update({
      where: { id: userCard.id },
      data: {
        state: numberToCardState(updatedCard.state),
        stability: updatedCard.stability,
        difficulty: updatedCard.difficulty,
        due: updatedCard.due,
        lastReview: updatedCard.lastReview,
      },
    });

    return updatedCard;
  }

  /**
   * Get statistics for a user's flashcards
   */
  async getStats(userId: string) {
    const now = new Date();

    // Count cards by state
    const newCount = await this.prisma.userFlashcard.count({
      where: { userId, state: CardState.NEW },
    });

    const learningCount = await this.prisma.userFlashcard.count({
      where: {
        userId,
        state: { in: [CardState.LEARNING, CardState.RELEARNING] },
      },
    });

    const reviewCount = await this.prisma.userFlashcard.count({
      where: { userId, state: CardState.REVIEW },
    });

    const dueCount = await this.prisma.userFlashcard.count({
      where: {
        userId,
        due: { lte: now },
      },
    });

    const total = await this.prisma.userFlashcard.count({
      where: { userId },
    });

    return {
      new: newCount,
      learning: learningCount,
      review: reviewCount,
      due: dueCount,
      total,
    };
  }

  /**
   * Start learning new cards
   */
  async learnNewCards(userId: string, count: number = 10) {
    // 1. Get IDs of cards user is already learning
    const userCards = await this.prisma.userFlashcard.findMany({
      where: { userId },
      select: { flashcardId: true },
    });

    const userCardIds = userCards.map(c => c.flashcardId);

    // 2. Find new cards not in user's list
    const newCards = await this.prisma.flashcardItem.findMany({
      where: {
        id: { notIn: userCardIds },
      },
      take: count,
      orderBy: { word: 'asc' }, // Or random? Alphabetical for now
    });

    if (newCards.length === 0) {
      return [];
    }

    // 3. Create UserFlashcard entries
    const operations = newCards.map(card => {
      const initStats = this.fsrs.initCard();
      return this.prisma.userFlashcard.create({
        data: {
          userId,
          flashcardId: card.id,
          state: numberToCardState(initStats.state),
          stability: initStats.stability,
          difficulty: initStats.difficulty,
          due: initStats.due,
          lastReview: initStats.lastReview,
        },
        include: { flashcard: true },
      });
    });

    return await this.prisma.$transaction(operations);
  }

  /**
   * Get all flashcard items for admin
   */
  async getAllFlashcards() {
    return this.prisma.flashcardItem.findMany({
      orderBy: {
        word: 'asc',
      },
    });
  }
}
