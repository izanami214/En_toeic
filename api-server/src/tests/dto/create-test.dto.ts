export class CreateQuestionDto {
    content: string;
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

export class CreatePartDto {
    partNumber: number;
    questions: CreateQuestionDto[];
}

export class CreateTestDto {
    title: string;
    type: 'FULL' | 'MINI' | 'PART'; // Use string literals instead of enum
    duration: number; // in seconds
    parts: CreatePartDto[];
}
