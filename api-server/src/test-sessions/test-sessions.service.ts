import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TestSessionsService {
    constructor(private prisma: PrismaService) { }

    /**
     * Start a new test session
     */
    async startSession(userId: string, testId: string) {
        const test = await this.prisma.test.findUnique({
            where: { id: testId },
        });

        if (!test) {
            throw new Error('Test not found');
        }

        const session = await this.prisma.testSession.create({
            data: {
                userId,
                testId,
                durationTaken: 0,
                answers: JSON.stringify([]),
            },
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
     */
    async submitSession(
        sessionId: string,
        answers: Array<{ questionId: string; selectedOption: string }>,
        durationTaken: number,
    ) {
        const session = await this.prisma.testSession.findUnique({
            where: { id: sessionId },
            include: {
                test: {
                    include: {
                        parts: {
                            include: {
                                questions: true,
                            },
                        },
                    },
                },
            },
        });

        if (!session) {
            throw new Error('Session not found');
        }

        // Calculate score
        let correctCount = 0;
        const detailedAnswers = answers.map((answer) => {
            const question = session.test.parts
                .flatMap((p) => p.questions)
                .find((q) => q.id === answer.questionId);

            const isCorrect = question?.correctOpt === answer.selectedOption;
            if (isCorrect) correctCount++;

            return {
                questionId: answer.questionId,
                selectedOption: answer.selectedOption,
                correctOption: question?.correctOpt,
                isCorrect,
            };
        });

        // TOEIC scoring (simplified - actual TOEIC uses conversion table)
        const totalQuestions = session.test.parts.flatMap((p) => p.questions).length;
        const score = Math.round((correctCount / totalQuestions) * 495); // Max 495 per section

        // Update session
        const updatedSession = await this.prisma.testSession.update({
            where: { id: sessionId },
            data: {
                score,
                durationTaken,
                answers: detailedAnswers,
            },
        });

        return {
            sessionId: updatedSession.id,
            score,
            correctCount,
            totalQuestions,
            answers: detailedAnswers,
        };
    }

    /**
     * Get session result
     */
    async getResult(sessionId: string) {
        const session = await this.prisma.testSession.findUnique({
            where: { id: sessionId },
            include: {
                test: {
                    include: {
                        parts: {
                            include: {
                                questions: true,
                            },
                        },
                    },
                },
            },
        });

        if (!session) {
            throw new Error('Session not found');
        }

        // Calculate total questions and correct answers
        const totalQuestions = session.test.parts.flatMap(p => p.questions).length;
        const answers = Array.isArray(session.answers) ? session.answers : [];
        const correctCount = answers.filter((a: any) => a.isCorrect).length;

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
            test: session.test, // Include full test data for review
        };
    }

    /**
     * Get user's test history
     */
    async getUserHistory(userId: string) {
        const sessions = await this.prisma.testSession.findMany({
            where: { userId },
            include: {
                test: true,
            },
            orderBy: {
                submittedAt: 'desc',
            },
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
