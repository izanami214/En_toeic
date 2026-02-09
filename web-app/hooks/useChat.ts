import { useState, useCallback, useEffect } from 'react';

export interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    createdAt: Date;
}

export interface UseChatReturn {
    messages: Message[];
    isLoading: boolean;
    error: string | null;
    sendMessage: (content: string) => Promise<void>;
    clearMessages: () => void;
    resetSession: () => void;
    deleteSession: (sessionId?: string) => Promise<void>;
    sessionId: string | null;
}

export function useChat(userId: string): UseChatReturn {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [sessionId, setSessionId] = useState<string | null>(null);

    // Load history on mount
    useEffect(() => {
        if (!userId) return;

        const loadHistory = async () => {
            try {
                // 1. Get user sessions
                const sessionsRes = await fetch(`http://localhost:3000/companion/sessions/${userId}`);
                if (!sessionsRes.ok) return;
                const sessions = await sessionsRes.json();

                if (sessions.length > 0) {
                    const lastSession = sessions[0];
                    setSessionId(lastSession.id);

                    // 2. Get full history for the last session
                    const historyRes = await fetch(`http://localhost:3000/companion/history/${lastSession.id}`);
                    if (historyRes.ok) {
                        const sessionData = await historyRes.json();
                        setMessages(sessionData.messages);
                    }
                }
            } catch (e) {
                console.error('Failed to load chat history:', e);
            }
        };

        loadHistory();
    }, [userId]);

    const sendMessage = useCallback(async (content: string) => {
        if (!content.trim()) return;

        // Add user message immediately
        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content,
            createdAt: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:3000/companion/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: content,
                    sessionId,
                    userId,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            const data = await response.json();

            // Update session ID if it's a new session
            if (data.sessionId && !sessionId) {
                setSessionId(data.sessionId);
            }

            // Add assistant message
            const assistantMessage: Message = {
                id: data.messageId,
                role: 'assistant',
                content: data.reply,
                createdAt: new Date(),
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            console.error('Chat error:', err);
        } finally {
            setIsLoading(false);
        }
    }, [sessionId, userId]);

    const resetSession = useCallback(() => {
        setMessages([]);
        setSessionId(null);
        setError(null);
    }, []);

    const deleteSession = useCallback(async (sessionIdToDelete?: string) => {
        const idToDelete = sessionIdToDelete || sessionId;
        if (!idToDelete) return;

        try {
            const response = await fetch(`http://localhost:3000/companion/sessions/${idToDelete}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete session');
            }

            // If deleting current session, reset state
            if (idToDelete === sessionId) {
                resetSession();
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete session');
            console.error('Delete session error:', err);
        }
    }, [sessionId, resetSession]);

    const clearMessages = useCallback(() => {
        setMessages([]);
        setSessionId(null);
        setError(null);
    }, []);

    return {
        messages,
        isLoading,
        error,
        sendMessage,
        clearMessages,
        resetSession,
        deleteSession,
        sessionId,
    };
}
