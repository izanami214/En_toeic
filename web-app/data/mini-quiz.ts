// Mini Quiz Database
// 20 TOEIC grammar and vocabulary questions

export interface QuizQuestion {
    id: number;
    question: string;
    options: string[];
    correctAnswer: number; // index of correct option (0-3)
    explanation: string;
    category: 'grammar' | 'vocabulary';
}

export const quizDatabase: QuizQuestion[] = [
    {
        id: 1,
        question: "The new policy will be _____ next month.",
        options: ["implement", "implemented", "implementing", "implementation"],
        correctAnswer: 1,
        explanation: "Câu bị động cần dùng past participle 'implemented'.",
        category: "grammar",
    },
    {
        id: 2,
        question: "We need someone who is _____ in graphic design.",
        options: ["proficient", "proficiency", "proficiently", "proficientness"],
        correctAnswer: 0,
        explanation: "'Proficient' (adj) = thành thạo, đi với 'be' và 'in'.",
        category: "vocabulary",
    },
    {
        id: 3,
        question: "The meeting has been _____ until further notice.",
        options: ["postpone", "postponed", "postponing", "postponement"],
        correctAnswer: 1,
        explanation: "Câu bị động với 'has been' cần past participle.",
        category: "grammar",
    },
    {
        id: 4,
        question: "Sales _____ expectations this quarter.",
        options: ["exceed", "exceeded", "exceeding", "exceedingly"],
        correctAnswer: 1,
        explanation: "'Exceeded' (past tense) vì 'this quarter' đã kết thúc.",
        category: "grammar",
    },
    {
        id: 5,
        question: "Please _____ your identity before proceeding.",
        options: ["verify", "verified", "verification", "verifying"],
        correctAnswer: 0,
        explanation: "Sau 'Please' dùng động từ nguyên mẫu.",
        category: "grammar",
    },
    {
        id: 6,
        question: "The company made a _____ profit last year.",
        options: ["consider", "considerable", "considerably", "consideration"],
        correctAnswer: 1,
        explanation: "'Considerable' (adj) = đáng kể, bổ nghĩa cho 'profit'.",
        category: "vocabulary",
    },
    {
        id: 7,
        question: "All employees must _____ to the dress code.",
        options: ["adhere", "adherence", "adherent", "adhering"],
        correctAnswer: 0,
        explanation: "Sau 'must' dùng động từ nguyên mẫu.",
        category: "grammar",
    },
    {
        id: 8,
        question: "The training was _____ for all new hires.",
        options: ["mandate", "mandatory", "mandatorily", "mandating"],
        correctAnswer: 1,
        explanation: "'Mandatory' (adj) = bắt buộc, đi với 'be'.",
        category: "vocabulary",
    },
    {
        id: 9,
        question: "We _____ a positive response from the investors.",
        options: ["anticipate", "anticipated", "anticipation", "anticipating"],
        correctAnswer: 0,
        explanation: "Câu hiện tại đơn diễn tả sự việc hiện tại.",
        category: "grammar",
    },
    {
        id: 10,
        question: "The renovation will _____ the value of the property.",
        options: ["enhance", "enhanced", "enhancing", "enhancement"],
        correctAnswer: 0,
        explanation: "Sau 'will' dùng động từ nguyên mẫu.",
        category: "grammar",
    },
    {
        id: 11,
        question: "She has _____ experience in project management.",
        options: ["extend", "extensive", "extensively", "extension"],
        correctAnswer: 1,
        explanation: "'Extensive' (adj) = phong phú, bổ nghĩa cho 'experience'.",
        category: "vocabulary",
    },
    {
        id: 12,
        question: "The team worked _____ to meet the deadline.",
        options: ["efficient", "efficiency", "efficiently", "efficientness"],
        correctAnswer: 2,
        explanation: "'Efficiently' (adv) bổ nghĩa cho động từ 'worked'.",
        category: "vocabulary",
    },
    {
        id: 13,
        question: "The hotel can _____ up to 500 guests.",
        options: ["accommodate", "accommodation", "accommodating", "accommodated"],
        correctAnswer: 0,
        explanation: "Sau 'can' dùng động từ nguyên mẫu.",
        category: "grammar",
    },
    {
        id: 14,
        question: "Only _____ personnel can access this area.",
        options: ["authorize", "authorized", "authorization", "authorizing"],
        correctAnswer: 1,
        explanation: "'Authorized' (adj) = được ủy quyền, bổ nghĩa cho 'personnel'.",
        category: "vocabulary",
    },
    {
        id: 15,
        question: "The _____ for applications is December 31st.",
        options: ["dead", "deadly", "deadline", "deaden"],
        correctAnswer: 2,
        explanation: "'Deadline' (noun) = hạn chót.",
        category: "vocabulary",
    },
    {
        id: 16,
        question: "Prices tend to _____ during the holiday season.",
        options: ["fluctuate", "fluctuated", "fluctuation", "fluctuating"],
        correctAnswer: 0,
        explanation: "Sau 'tend to' dùng động từ nguyên mẫu.",
        category: "grammar",
    },
    {
        id: 17,
        question: "The proposal seems financially _____.",
        options: ["viable", "viability", "viably", "viableness"],
        correctAnswer: 0,
        explanation: "'Viable' (adj) = khả thi, đi với 'seem'.",
        category: "vocabulary",
    },
    {
        id: 18,
        question: "We need to _____ our marketing strategies.",
        options: ["coordinate", "coordinated", "coordination", "coordinating"],
        correctAnswer: 0,
        explanation: "Sau 'need to' dùng động từ nguyên mẫu.",
        category: "grammar",
    },
    {
        id: 19,
        question: "The report provides a _____ analysis of the market.",
        options: ["comprehend", "comprehensive", "comprehensively", "comprehension"],
        correctAnswer: 1,
        explanation: "'Comprehensive' (adj) = toàn diện, bổ nghĩa cho 'analysis'.",
        category: "vocabulary",
    },
    {
        id: 20,
        question: "The product comes with a two-year _____.",
        options: ["warrant", "warranty", "warranted", "warranting"],
        correctAnswer: 1,
        explanation: "'Warranty' (noun) = bảo hành.",
        category: "vocabulary",
    },
];

// Helper function to get a random quiz question
export function getRandomQuestion(): QuizQuestion {
    const randomIndex = Math.floor(Math.random() * quizDatabase.length);
    return quizDatabase[randomIndex];
}
