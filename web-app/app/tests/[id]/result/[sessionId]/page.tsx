'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getSessionResult } from '@/lib/api';
import { ArrowLeft, CheckCircle, XCircle, Clock, Trophy, RefreshCw, Home, History, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function ResultPage() {
    const params = useParams();
    const router = useRouter();
    const sessionId = params.sessionId as string;
    const testId = params.id as string;

    const { data: result, isLoading, error } = useQuery({
        queryKey: ['result', sessionId],
        queryFn: () => getSessionResult(sessionId),
    });

    const [showReview, setShowReview] = useState(false);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">Đang tải kết quả...</div>
            </div>
        );
    }

    if (error || !result) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-red-500">Không tìm thấy kết quả bài thi</div>
            </div>
        );
    }

    const percentage = Math.round((result.correctCount / result.totalQuestions) * 100);
    const allQuestions = result.test?.parts?.flatMap((part: any) => part.questions) || [];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <button
                    onClick={() => router.push(`/tests/${testId}`)}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Quay lại trang đề thi
                </button>

                {/* Score Card */}
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-8">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 md:p-12 text-white text-center">
                        <div className="flex justify-center mb-6">
                            <div className="relative">
                                <Trophy className="w-20 h-20" />
                                <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 rounded-full w-10 h-10 flex items-center justify-center font-bold text-sm">
                                    {percentage}%
                                </div>
                            </div>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold mb-2">Kết Quả Bài Thi</h1>
                        <p className="text-blue-100 text-lg mb-6">{result.testTitle}</p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                                <div className="text-5xl font-bold mb-2">{result.score || 0}</div>
                                <div className="text-blue-100 text-sm uppercase tracking-wider">Điểm TOEIC</div>
                            </div>

                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                                <div className="text-5xl font-bold mb-2">
                                    {result.correctCount}/{result.totalQuestions}
                                </div>
                                <div className="text-blue-100 text-sm uppercase tracking-wider">Câu Đúng</div>
                            </div>

                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                                <div className="text-5xl font-bold mb-2">
                                    {Math.floor(result.durationTaken / 60)}'
                                </div>
                                <div className="text-blue-100 text-sm uppercase tracking-wider">Thời Gian</div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="p-6 bg-gray-50 border-t flex flex-wrap gap-4 justify-center">
                        <Link
                            href={`/tests/${testId}`}
                            className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-all hover:scale-105 shadow-md"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Quay Lại
                        </Link>

                        <Link
                            href="/history"
                            className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all hover:scale-105 shadow-md"
                        >
                            <History className="w-5 h-5" />
                            Xem Lịch Sử
                        </Link>

                        <Link
                            href={`/tests/${testId}`}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all hover:scale-105 shadow-md"
                        >
                            <RefreshCw className="w-5 h-5" />
                            Làm Lại Bài Thi
                        </Link>

                        <Link
                            href="/tests"
                            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all hover:scale-105 shadow-md"
                        >
                            <Home className="w-5 h-5" />
                            Trang Chủ
                        </Link>
                    </div>
                </div>

                {/* Question Review */}
                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                            <History className="w-7 h-7 text-blue-600" />
                            Xem Lại Chi Tiết
                        </h2>
                        <button
                            onClick={() => setShowReview(!showReview)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all hover:scale-105 shadow-md"
                        >
                            {showReview ? (
                                <>
                                    <EyeOff className="w-5 h-5" />
                                    <span className="hidden md:inline">Ẩn Chi Tiết</span>
                                </>
                            ) : (
                                <>
                                    <Eye className="w-5 h-5" />
                                    <span className="hidden md:inline">Hiện Chi Tiết</span>
                                </>
                            )}
                        </button>
                    </div>

                    {showReview && (
                        <div className="space-y-6">
                            {Array.isArray(result.answers) && result.answers.map((answer: any, index: number) => {
                                const question = allQuestions.find((q: any) => q.id === answer.questionId);
                                if (!question) return null;

                                const isCorrect = answer.isCorrect;

                                return (
                                    <div
                                        key={answer.questionId}
                                        className={`border-2 rounded-xl p-6 transition-all ${isCorrect
                                            ? 'border-green-300 bg-green-50'
                                            : 'border-red-300 bg-red-50'
                                            }`}
                                    >
                                        <div className="flex items-start gap-4 mb-4">
                                            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${isCorrect ? 'bg-green-500' : 'bg-red-500'
                                                }`}>
                                                {isCorrect ? (
                                                    <CheckCircle className="w-6 h-6 text-white" />
                                                ) : (
                                                    <XCircle className="w-6 h-6 text-white" />
                                                )}
                                            </div>

                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="font-bold text-gray-700">Câu {index + 1}</span>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${isCorrect ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                                                        }`}>
                                                        {isCorrect ? 'Đúng' : 'Sai'}
                                                    </span>
                                                </div>

                                                <p className="text-gray-800 mb-4 leading-relaxed">
                                                    {question.content}
                                                </p>

                                                <div className="space-y-2 mb-4">
                                                    {Object.entries(question.options).map(([key, value]) => {
                                                        const isUserAnswer = answer.selectedOption === key;
                                                        const isCorrectAnswer = answer.correctOption === key;

                                                        return (
                                                            <div
                                                                key={key}
                                                                className={`p-3 rounded-lg border-2 ${isCorrectAnswer
                                                                    ? 'border-green-500 bg-green-100'
                                                                    : isUserAnswer
                                                                        ? 'border-red-500 bg-red-100'
                                                                        : 'border-gray-200 bg-white'
                                                                    }`}
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    {isCorrectAnswer && <CheckCircle className="w-5 h-5 text-green-600" />}
                                                                    {!isCorrectAnswer && isUserAnswer && <XCircle className="w-5 h-5 text-red-600" />}

                                                                    <span className="font-semibold text-gray-700">{key}.</span>
                                                                    <span className="text-gray-800">{value as string}</span>

                                                                    {isUserAnswer && !isCorrectAnswer && (
                                                                        <span className="ml-auto text-xs text-red-600 font-medium">Bạn chọn</span>
                                                                    )}
                                                                    {isCorrectAnswer && (
                                                                        <span className="ml-auto text-xs text-green-600 font-medium">Đáp án đúng</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>

                                                {question.explanation && (
                                                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                                                        <p className="text-sm text-gray-700">
                                                            <strong className="text-blue-700">📝 Giải thích:</strong> {question.explanation}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
