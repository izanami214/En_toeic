import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { GamificationService } from '../gamification/gamification.service';

// Shared include for fetching a test with all questions (standalone + group)
const TEST_FULL_INCLUDE = {
    parts: {
        include: {
            questions: {
                where: { groupId: null }, // standalone only
            },
            groups: {
                include: {
                    questions: true, // group questions
                },
            },
        },
    },
};

/** Flatten all questions from a test: standalone first, then group questions */
function getAllQuestions(test: {
    parts: Array<{
        questions: Array<{ id: string; correctOpt: string }>;
        groups: Array<{ questions: Array<{ id: string; correctOpt: string }> }>;
    }>;
}) {
    const qs: Array<{ id: string; correctOpt: string }> = [];
    for (const part of test.parts) {
        for (const q of part.questions) qs.push(q);
        for (const group of part.groups) {
            for (const q of group.questions) qs.push(q);
        }
    }
    return qs;
}

@Injectable()
export class TestSessionsService {
    constructor(
        private prisma: PrismaService,
        private gamificationService: GamificationService,
    ) { }

    /**
     * Start a new test session
     */
    async startSession(userId: string, testId: string) {
        const test = await this.prisma.test.findUnique({ where: { id: testId } });
        if (!test) throw new Error('Test not found');

        const session = await this.prisma.testSession.create({
            data: { userId, testId, durationTaken: 0, answers: JSON.stringify([]) },
        });

        return {
            sessionId: session.id,
            testId: test.id,
            duration: test.duration,
            startedAt: session.submittedAt,
        };
    }

    /**
     * Submit test answers and calculate score
     * Now includes group questions in scoring.
     */
    async submitSession(
        sessionId: string,
        answers: Array<{ questionId: string; selectedOption: string }>,
        durationTaken: number,
    ) {
        const session = await this.prisma.testSession.findUnique({
            where: { id: sessionId },
            include: { test: { include: TEST_FULL_INCLUDE } },
        });

        if (!session) throw new Error('Session not found');

        // Flatten ALL questions (standalone + group)
        const allQuestions = getAllQuestions(session.test as Parameters<typeof getAllQuestions>[0]);

        // Build a lookup map: questionId -> correctOpt
        const questionMap = new Map(allQuestions.map(q => [q.id, q.correctOpt]));

        let correctCount = 0;
        const detailedAnswers = answers.map((answer) => {
            const correctOpt = questionMap.get(answer.questionId);
            const isCorrect = correctOpt === answer.selectedOption;
            if (isCorrect) correctCount++;

            return {
                questionId: answer.questionId,
                selectedOption: answer.selectedOption,
                correctOption: correctOpt ?? null,
                isCorrect,
            };
        });

        const totalQuestions = allQuestions.length;
        // TOEIC simplified: max 495 per section
        const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 495) : 0;

        // Update session in DB
        const updatedSession = await this.prisma.testSession.update({
            where: { id: sessionId },
            data: { score, durationTaken, answers: detailedAnswers },
        });

        // Award XP (base 50 + bonus)
        const xpAmount = 50 + Math.floor(score / 5);
        await this.gamificationService.addXp(
            session.userId,
            xpAmount,
            `Completed Test: ${session.test.title}`,
        );

        return {
            sessionId: updatedSession.id,
            score,
            correctCount,
            totalQuestions,
            answers: detailedAnswers,
        };
    }

    /**
     * Get session result with full test structure for review
     */
    async getResult(sessionId: string) {
        const session = await this.prisma.testSession.findUnique({
            where: { id: sessionId },
            include: { test: { include: TEST_FULL_INCLUDE } },
        });

        if (!session) throw new Error('Session not found');

        const allQuestions = getAllQuestions(session.test as Parameters<typeof getAllQuestions>[0]);
        const totalQuestions = allQuestions.length;
        const answers = Array.isArray(session.answers) ? session.answers : [];
        const correctCount = answers.filter((a: { isCorrect: boolean }) => a.isCorrect).length;

        return {
            sessionId: session.id,
            testTitle: session.test.title,
            testType: session.test.type,
            score: session.score,
            correctCount,
            totalQuestions,
            durationTaken: session.durationTaken,
            submittedAt: session.submittedAt,
            answers: session.answers,
            test: session.test, // Full test with parts → groups → questions for review UI
        };
    }

    /**
     * Get user's test history
     */
    async getUserHistory(userId: string) {
        const sessions = await this.prisma.testSession.findMany({
            where: { userId },
            include: { test: true },
            orderBy: { submittedAt: 'desc' },
        });

        return sessions.map((s) => ({
            sessionId: s.id,
            testId: s.testId,
            testTitle: s.test.title,
            testType: s.test.type,
            score: s.score,
            durationTaken: s.durationTaken,
            submittedAt: s.submittedAt,
        }));
    }
}
