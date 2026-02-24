export class CreateQuestionDto {
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
    orderIndex?: number;
}

export class CreateQuestionGroupDto {
    title?: string;      // "Questions 147–150 refer to the following email."
    passage?: string;    // The reading text / passage
    imageUrl?: string;   // Optional passage image
    audioUrl?: string;   // Shared listening audio
    orderIndex?: number;
    questions: CreateQuestionDto[];
}

export class CreatePartDto {
    partNumber: number;
    questions?: CreateQuestionDto[];  // standalone (no passage)
    groups?: CreateQuestionGroupDto[]; // grouped (with passage)
}

export class CreateTestDto {
    title: string;
    type: 'FULL' | 'MINI' | 'PART';
    duration: number; // in seconds
    parts: CreatePartDto[];
}
