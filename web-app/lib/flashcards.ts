import { getFlashcardsDue, reviewFlashcard, getFlashcardStats } from '@/lib/api';

export const Rating = {
    Again: 1,
    Hard: 2,
    Good: 3,
    Easy: 4,
} as const;

export type RatingType = typeof Rating[keyof typeof Rating];

export { getFlashcardsDue, reviewFlashcard, getFlashcardStats };
