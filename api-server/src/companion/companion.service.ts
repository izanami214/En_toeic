import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { LlmService } from './llm.service';

export interface SendMessageDto {
    message: string;
    sessionId?: string;
    userId: string;
}

export interface ChatResponse {
    sessionId: string;
    reply: string;
    messageId: string;
}

@Injectable()
export class CompanionService {
    constructor(
        private prisma: PrismaService,
        private llm: LlmService,
    ) { }

    /**
     * Send a message and get AI response
     */
    async sendMessage(dto: SendMessageDto): Promise<ChatResponse> {
        const { message, sessionId, userId } = dto;

        // Get or create session
        let session;
        if (sessionId) {
            session = await this.prisma.chatSession.findUnique({
                where: { id: sessionId },
                include: { messages: { orderBy: { createdAt: 'asc' } } },
            });
            if (!session) {
                throw new Error('Session not found');
            }
        } else {
            // Create new session
            session = await this.prisma.chatSession.create({
                data: {
                    userId,
                    title: message.substring(0, 50), // Use first 50 chars as title
                },
                include: { messages: true },
            });
        }

        // Save user message
        const userMessage = await this.prisma.chatMessage.create({
            data: {
                sessionId: session.id,
                role: 'user',
                content: message,
            },
        });

        // Get user info for context
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        // Build context from previous messages
        const previousMessages = session.messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
        }));

        // Generate AI response
        const aiReply = await this.llm.generateResponse(message, {
            userName: user?.fullName || undefined,
            previousMessages,
        });

        // Save assistant message
        const assistantMessage = await this.prisma.chatMessage.create({
            data: {
                sessionId: session.id,
                role: 'assistant',
                content: aiReply,
            },
        });

        return {
            sessionId: session.id,
            reply: aiReply,
            messageId: assistantMessage.id,
        };
    }

    /**
     * Get chat history for a session
     */
    async getHistory(sessionId: string) {
        const session = await this.prisma.chatSession.findUnique({
            where: { id: sessionId },
            include: {
                messages: {
                    orderBy: { createdAt: 'asc' },
                },
            },
        });

        if (!session) {
            throw new Error('Session not found');
        }

        return session;
    }

    /**
     * Get all sessions for a user
     */
    async getSessions(userId: string) {
        return this.prisma.chatSession.findMany({
            where: { userId },
            include: {
                messages: {
                    take: 1,
                    orderBy: { createdAt: 'desc' },
                },
            },
            orderBy: { updatedAt: 'desc' },
        });
    }

    /**
     * Delete a chat session and all its messages
     */
    async deleteSession(sessionId: string) {
        // Delete all messages first (due to foreign key constraint)
        await this.prisma.chatMessage.deleteMany({
            where: { sessionId },
        });

        // Then delete the session
        try {
            const deleted = await this.prisma.chatSession.delete({
                where: { id: sessionId },
            });
            return { success: true, deletedSessionId: deleted.id };
        } catch (error) {
            // If record not found (P2025), return success as it's already gone
            if (error.code === 'P2025') {
                return { success: true, deletedSessionId: sessionId };
            }
            throw error;
        }
    }
}
