import { Injectable } from '@nestjs/common';

/**
 * FSRS (Free Spaced Repetition Scheduler) Algorithm
 * Based on: https://github.com/open-spaced-repetition/fsrs4anki
 */

export enum Rating {
    Again = 1,
    Hard = 2,
    Good = 3,
    Easy = 4,
}

export interface Card {
    state: number; // 0: New, 1: Learning, 2: Review, 3: Relearning
    stability: number;
    difficulty: number;
    due: Date;
    lastReview: Date;
}

@Injectable()
export class FsrsService {
    // FSRS Parameters (can be tuned)
    private readonly w = [
        0.4, 0.6, 2.4, 5.8, 4.93, 0.94, 0.86, 0.01, 1.49, 0.14, 0.94, 2.18, 0.05,
        0.34, 1.26, 0.29, 2.61,
    ];

    /**
     * Calculate next review schedule based on rating
     */
    scheduleCard(card: Card, rating: Rating): Card {
        const now = new Date();

        // Calculate new stability
        const newStability = this.calculateStability(card, rating);

        // Calculate new difficulty
        const newDifficulty = this.calculateDifficulty(card.difficulty, rating);

        // Calculate interval (days)
        const interval = this.calculateInterval(newStability);

        // Calculate next due date
        const due = new Date(now.getTime() + interval * 24 * 60 * 60 * 1000);

        // Determine new state
        let newState = card.state;
        if (rating === Rating.Again) {
            newState = card.state === 0 ? 1 : 3; // New -> Learning, Review -> Relearning
        } else if (card.state === 0 || card.state === 1) {
            newState = 2; // Learning -> Review
        } else if (card.state === 3) {
            newState = 2; // Relearning -> Review
        }

        return {
            state: newState,
            stability: newStability,
            difficulty: newDifficulty,
            due,
            lastReview: now,
        };
    }

    private calculateStability(card: Card, rating: Rating): number {
        if (card.state === 0) {
            // New card
            return this.w[rating - 1];
        }

        const elapsed = this.daysBetween(card.lastReview, new Date());
        const retrievability = Math.pow(
            1 + (elapsed / (9 * card.stability)),
            -1
        );

        if (rating === Rating.Again) {
            return this.w[11] * Math.pow(card.difficulty, -this.w[12]) *
                (Math.pow(card.stability + 1, this.w[13]) - 1) *
                Math.exp(this.w[14] * (1 - retrievability));
        }

        const hardPenalty = rating === Rating.Hard ? this.w[15] : 1;
        const easyBonus = rating === Rating.Easy ? this.w[16] : 1;

        return card.stability *
            (1 + Math.exp(this.w[8]) *
                (11 - card.difficulty) *
                Math.pow(card.stability, -this.w[9]) *
                (Math.exp((1 - retrievability) * this.w[10]) - 1) *
                hardPenalty *
                easyBonus);
    }

    private calculateDifficulty(currentDifficulty: number, rating: Rating): number {
        const difficultyChange = this.w[6] * (rating - 3);
        const newDifficulty = currentDifficulty - difficultyChange;

        // Clamp between 1 and 10
        return Math.max(1, Math.min(10, newDifficulty));
    }

    private calculateInterval(stability: number): number {
        // Target 90% retrievability
        const requestedRetention = 0.9;
        return (9 * stability) / requestedRetention * (1 / requestedRetention - 1);
    }

    private daysBetween(date1: Date, date2: Date): number {
        const diff = date2.getTime() - date1.getTime();
        return diff / (1000 * 60 * 60 * 24);
    }

    /**
     * Initialize a new card
     */
    initCard(): Card {
        return {
            state: 0,
            stability: 0,
            difficulty: 5, // Default medium difficulty
            due: new Date(),
            lastReview: new Date(),
        };
    }
}
