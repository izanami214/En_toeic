'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { BookOpen, History, MessageCircle, Target, X, Lightbulb, Settings, Send, Plus, Trash2 } from 'lucide-react';
import DailyWord from './features/DailyWord';
import MiniQuiz from './features/MiniQuiz';
import { useChat } from '@/hooks/useChat';

interface ChatWidgetProps {
    onClose: () => void;
}

export default function ChatWidget({ onClose }: ChatWidgetProps) {
    const [activeTab, setActiveTab] = useState<'chat' | 'tools' | 'settings'>('chat');
    const [inputValue, setInputValue] = useState('');
    const [showHistory, setShowHistory] = useState(false);
    const [deleteConfirmSessionId, setDeleteConfirmSessionId] = useState<string | null>(null);
    const [sessions, setSessions] = useState<any[]>([]);
    const [loadingSessions, setLoadingSessions] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // TODO: Get actual user ID from auth context
    // For now, using the first user from database
    const userId = '63fec151-3dfc-496d-8281-ba236a57b1d3';
    const { messages, isLoading, sendMessage, resetSession, deleteSession, sessionId } = useChat(userId);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchSessions = async () => {
        setLoadingSessions(true);
        try {
            const response = await fetch(`http://localhost:3000/companion/sessions/${userId}`);
            if (response.ok) {
                const data = await response.json();
                setSessions(data);
            }
        } catch (err) {
            console.error('Failed to fetch sessions:', err);
        } finally {
            setLoadingSessions(false);
        }
    };

    const loadSession = async (sessionIdToLoad: string) => {
        try {
            const response = await fetch(`http://localhost:3000/companion/history/${sessionIdToLoad}`);
            if (response.ok) {
                const sessionData = await response.json();
                // This will be handled by useChat hook's effect
                window.location.reload(); // Temporary: reload to load the session
            }
        } catch (err) {
            console.error('Failed to load session:', err);
        }
        setShowHistory(false);
    };

    const handleSend = async () => {
        if (!inputValue.trim() || isLoading) return;

        const message = inputValue;
        setInputValue('');
        await sendMessage(message);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="mb-4 animate-scaleIn">
            <div className="bg-white rounded-3xl shadow-2xl border-2 border-blue-200 w-80 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <h3 className="text-white font-bold">Tobi Assistant</h3>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* History Button */}
                        <button
                            onClick={() => {
                                setShowHistory(!showHistory);
                                if (!showHistory) fetchSessions();
                            }}
                            className="text-white hover:bg-white/20 rounded-full p-1.5 transition-colors"
                            title="Lịch sử chat"
                        >
                            <History className="w-4 h-4" />
                        </button>
                        {/* New Chat Button */}
                        <button
                            onClick={resetSession}
                            className="text-white hover:bg-white/20 rounded-full p-1.5 transition-colors"
                            title="Tạo đoạn chat mới"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                        {/* Delete Session Button */}
                        {sessionId && messages.length > 0 && (
                            <button
                                onClick={() => {
                                    setDeleteConfirmSessionId(sessionId);
                                }}
                                className="text-white hover:bg-red-500/50 rounded-full p-1.5 transition-colors"
                                title="Xóa đoạn chat này"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="text-white hover:bg-white/20 rounded-full p-1.5 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* History Modal */}
                {showHistory && (
                    <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl w-full max-w-sm max-h-[80%] overflow-hidden flex flex-col shadow-2xl">
                            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 flex items-center justify-between">
                                <h3 className="text-white font-bold">Lịch sử chat</h3>
                                <button
                                    onClick={() => setShowHistory(false)}
                                    className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4">
                                {loadingSessions ? (
                                    <div className="text-center py-8 text-gray-500">Đang tải...</div>
                                ) : sessions.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">Chưa có lịch sử chat nào</div>
                                ) : (
                                    <div className="space-y-2">
                                        {sessions.map((session) => (
                                            <div
                                                key={session.id}
                                                className={`p-3 rounded-xl border-2 transition-all cursor-pointer hover:bg-blue-50 ${session.id === sessionId
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-200 hover:border-blue-300'
                                                    }`}
                                                onClick={() => loadSession(session.id)}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <p className="font-medium text-gray-800 text-sm line-clamp-2">
                                                            {session.title || 'Cuộc trò chuyện mới'}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {new Date(session.updatedAt).toLocaleDateString('vi-VN', {
                                                                day: '2-digit',
                                                                month: '2-digit',
                                                                year: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                            })}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setDeleteConfirmSessionId(session.id);
                                                        }}
                                                        className="text-red-500 hover:bg-red-100 rounded-full p-1 ml-2"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {deleteConfirmSessionId && (
                    <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/60 z-[60] flex items-center justify-center p-6 animate-fadeIn">
                        <div className="bg-white rounded-2xl w-full max-w-xs shadow-2xl p-6 transform scale-100 animate-scaleIn">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trash2 className="w-6 h-6 text-red-500" />
                            </div>
                            <h3 className="text-lg font-bold text-center text-gray-900 mb-2">Xóa đoạn chat?</h3>
                            <p className="text-sm text-center text-gray-500 mb-6">
                                Bạn có chắc chắn muốn xóa đoạn chat này không? Hành động này không thể hoàn tác.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDeleteConfirmSessionId(null)}
                                    className="flex-1 py-2.5 px-4 rounded-xl font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={async () => {
                                        await deleteSession(deleteConfirmSessionId);
                                        if (showHistory) fetchSessions();
                                        setDeleteConfirmSessionId(null);
                                    }}
                                    className="flex-1 py-2.5 px-4 rounded-xl font-medium text-white bg-red-500 hover:bg-red-600 shadow-lg shadow-red-200 transition-all hover:scale-105"
                                >
                                    Xóa
                                </button>
                            </div>
                        </div>
                    </div>
                )
                }

                {/* Tabs */}
                <div className="flex border-b border-gray-200 bg-gray-50">
                    <button
                        onClick={() => setActiveTab('chat')}
                        className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${activeTab === 'chat'
                            ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <MessageCircle className="w-4 h-4 inline-block mr-1" />
                        Chat
                    </button>
                    <button
                        onClick={() => setActiveTab('tools')}
                        className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${activeTab === 'tools'
                            ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <Lightbulb className="w-4 h-4 inline-block mr-1" />
                        Tools
                    </button>
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${activeTab === 'settings'
                            ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <Settings className="w-4 h-4 inline-block mr-1" />
                        Settings
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-hidden">
                    {/* Chat Tab */}
                    {activeTab === 'chat' && (
                        <div className="flex flex-col h-[500px]">
                            {/* Messages Area */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                {messages.length === 0 ? (
                                    <div className="text-center py-8">
                                        <div className="mb-4 p-3 bg-blue-50 rounded-2xl">
                                            <p className="text-sm text-gray-700">
                                                Xin chào! Tôi là <span className="font-bold text-blue-600">Tobi</span> 🤖
                                                <br />
                                                Tôi có thể giúp gì cho bạn hôm nay?
                                            </p>
                                        </div>

                                        {/* Quick Actions */}
                                        <div className="space-y-2 mt-4">
                                            <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Truy cập nhanh</p>

                                            <Link
                                                href="/tests"
                                                className="flex items-center gap-3 p-3 hover:bg-blue-50 rounded-xl transition-colors group"
                                                onClick={onClose}
                                            >
                                                <div className="bg-blue-100 p-2 rounded-lg group-hover:scale-110 transition-transform">
                                                    <BookOpen className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-800 text-sm">Luyện thi</p>
                                                    <p className="text-xs text-gray-500">Bắt đầu làm đề ngay</p>
                                                </div>
                                            </Link>

                                            <Link
                                                href="/flashcards"
                                                className="flex items-center gap-3 p-3 hover:bg-purple-50 rounded-xl transition-colors group"
                                                onClick={onClose}
                                            >
                                                <div className="bg-purple-100 p-2 rounded-lg group-hover:scale-110 transition-transform">
                                                    <Target className="w-5 h-5 text-purple-600" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-800 text-sm">Từ vựng</p>
                                                    <p className="text-xs text-gray-500">Ôn tập flashcard</p>
                                                </div>
                                            </Link>

                                            <Link
                                                href="/history"
                                                className="flex items-center gap-3 p-3 hover:bg-green-50 rounded-xl transition-colors group"
                                                onClick={onClose}
                                            >
                                                <div className="bg-green-100 p-2 rounded-lg group-hover:scale-110 transition-transform">
                                                    <History className="w-5 h-5 text-green-600" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-800 text-sm">Lịch sử</p>
                                                    <p className="text-xs text-gray-500">Xem tiến độ học tập</p>
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {messages.map((msg) => (
                                            <div
                                                key={msg.id}
                                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div
                                                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${msg.role === 'user'
                                                        ? 'bg-blue-500 text-white'
                                                        : 'bg-gray-100 text-gray-800'
                                                        }`}
                                                >
                                                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {isLoading && (
                                            <div className="flex justify-start">
                                                <div className="bg-gray-100 rounded-2xl px-4 py-2">
                                                    <p className="text-sm text-gray-600">Tobi đang suy nghĩ...</p>
                                                </div>
                                            </div>
                                        )}
                                        <div ref={messagesEndRef} />
                                    </>
                                )}
                            </div>

                            {/* Input Area */}
                            <div className="p-4 border-t border-gray-200 bg-gray-50">
                                <div className="flex items-end gap-2">
                                    <textarea
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyDown={handleKeyPress}
                                        placeholder="Nhắn tin cho Tobi..."
                                        className="flex-1 resize-none rounded-xl border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[40px] max-h-[100px]"
                                        rows={1}
                                    />
                                    <button
                                        onClick={handleSend}
                                        disabled={!inputValue.trim() || isLoading}
                                        className="bg-blue-500 text-white rounded-xl p-2 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tools Tab */}
                    {activeTab === 'tools' && (
                        <div className="p-4 max-h-[500px] overflow-y-auto space-y-4">
                            <DailyWord />
                            <MiniQuiz />
                        </div>
                    )}

                    {/* Settings Tab */}
                    {activeTab === 'settings' && (
                        <div className="p-4 max-h-[500px] overflow-y-auto space-y-3">
                            <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Cài đặt</p>

                            <div className="p-3 bg-gray-50 rounded-xl">
                                <p className="text-sm font-semibold text-gray-700 mb-2">🎨 Màu sắc Tobi</p>
                                <div className="text-xs text-gray-500">Đổi màu robot (Coming soon...)</div>
                            </div>

                            <div className="p-3 bg-gray-50 rounded-xl">
                                <p className="text-sm font-semibold text-gray-700 mb-2">🔔 Thông báo</p>
                                <div className="text-xs text-gray-500">Nhắc nhở học tập (Coming soon...)</div>
                            </div>

                            <div className="p-3 bg-gray-50 rounded-xl">
                                <p className="text-sm font-semibold text-gray-700 mb-2">ℹ️ Phiên bản</p>
                                <div className="text-xs text-gray-500">Tobi V2.0 - AI Companion</div>
                            </div>
                        </div>
                    )}
                </div>
            </div >
        </div >
    );
}
