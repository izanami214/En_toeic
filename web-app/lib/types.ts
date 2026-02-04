// Enums matching Prisma schema
export enum UserRole {
    ADMIN = 'ADMIN',
    USER = 'USER',
}

export enum TestType {
    FULL = 'FULL',
    MINI = 'MINI',
    PART = 'PART',
}

export enum CardState {
    NEW = 'NEW',
    LEARNING = 'LEARNING',
    REVIEW = 'REVIEW',
    RELEARNING = 'RELEARNING',
}

// Domain Models
export interface User {
    id: string;
    email: string;
    fullName?: string;
    avatarUrl?: string;
    targetScore: number;
    currentScore?: number;
    createdAt: Date;
    updatedAt: Date;
    role: UserRole;
}

export interface Question {
    id: string;
    partId: string;
    content?: string;
    imageUrl?: string;
    audioUrl?: string;
    transcript?: string;
    options: {
        A: string;
        B: string;
        C: string;
        D: string;
    };
    correctOpt: string;
    explanation?: string;
}

export interface Part {
    id: string;
    testId: string;
    partNumber: number;
    questions: Question[];
}

export interface Test {
    id: string;
    title: string;
    type: TestType;
    duration: number; // in seconds
    createdAt: Date;
    updatedAt: Date;
    parts: Part[];
}

export interface TestSession {
    id: string;
    userId: string;
    testId: string;
    score?: number;
    durationTaken: number;
    submittedAt: Date;
    answers: Array<{
        questionId: string;
        selectedOption: string;
        isCorrect: boolean;
        timeSpent: number;
    }>;
}

export interface FlashcardItem {
    id: string;
    word: string;
    definition: string;
    pronunciation?: string;
    example?: string;
    questionId?: string;
}

export interface UserFlashcard {
    id: string;
    userId: string;
    flashcardId: string;
    state: CardState;
    stability: number;
    difficulty: number;
    due: Date;
    lastReview: Date;
}

// DTOs for API requests
export interface CreateQuestionDto {
    content?: string;
    options: {
        A: string;
        B: string;
        C: string;
        D: string;
    };
    correctOpt: string;
    explanation?: string;
    imageUrl?: string;
    audioUrl?: string;
    transcript?: string;
}

export interface CreatePartDto {
    partNumber: number;
    questions: CreateQuestionDto[];
}

export interface CreateTestDto {
    title: string;
    type: TestType;
    duration: number; // in seconds
    parts: CreatePartDto[];
}

export interface UpdateTestDto {
    title?: string;
    type?: TestType;
    duration?: number;
}
