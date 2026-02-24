'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getSessionResult } from '@/lib/api';
import { ArrowLeft, CheckCircle, XCircle, Trophy, RefreshCw, Home, History, Eye, EyeOff, BookOpen } from 'lucide-react';
import Link from 'next/link';

// ── Types ──────────────────────────────────────────────────────────
interface FlatQuestion {
    id: string;
    content?: string;
    options: Record<string, string>;
    explanation?: string;
    imageUrl?: string;
    // Group context
    groupId?: string;
    groupTitle?: string;
    groupPassage?: string;
    groupImageUrl?: string;
    groupAudioUrl?: string;
}

interface AnswerRecord {
    questionId: string;
    isCorrect: boolean;
    selectedOption: string;
    correctOption: string;
}

// ── Helpers ───────────────────────────────────────────────────────
function flattenQuestions(test: {
    parts?: Array<{
        questions?: FlatQuestion[];
        groups?: Array<{
            id: string;
            title?: string;
            passage?: string;
            imageUrl?: string;
            audioUrl?: string;
            questions?: FlatQuestion[];
        }>;
    }>;
}): FlatQuestion[] {
    const result: FlatQuestion[] = [];
    for (const part of test.parts ?? []) {
        for (const q of part.questions ?? []) result.push({ ...q });
        for (const group of part.groups ?? []) {
            for (const q of group.questions ?? []) {
                result.push({
                    ...q,
                    groupId: group.id,
                    groupTitle: group.title,
                    groupPassage: group.passage,
                    groupImageUrl: group.imageUrl,
                    groupAudioUrl: group.audioUrl,
                });
            }
        }
    }
    return result;
}

// ── Component ─────────────────────────────────────────────────────
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
        return <div className="flex items-center justify-center min-h-screen text-gray-600">Đang tải kết quả...</div>;
    }

    if (error || !result) {
        return <div className="flex items-center justify-center min-h-screen text-red-500">Không tìm thấy kết quả bài thi</div>;
    }

    // Flatten ALL questions including those inside groups
    const allQuestions = flattenQuestions(result.test ?? {});
    const questionMap = new Map(allQuestions.map((q) => [q.id, q]));

    const percentage = result.totalQuestions > 0
        ? Math.round((result.correctCount / result.totalQuestions) * 100)
        : 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
            <div className="max-w-5xl mx-auto">
                {/* Back button */}
                <button onClick={() => router.push(`/tests/${testId}`)}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                    Quay lại trang đề thi
                </button>

                {/* ── Score Card ── */}
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
                                <div className="text-5xl font-bold mb-2">{result.score ?? 0}</div>
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
                                    {Math.floor((result.durationTaken ?? 0) / 60)}&apos;
                                </div>
                                <div className="text-blue-100 text-sm uppercase tracking-wider">Thời Gian</div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="p-6 bg-gray-50 border-t flex flex-wrap gap-4 justify-center">
                        <Link href={`/tests/${testId}`}
                            className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-all hover:scale-105 shadow-md">
                            <ArrowLeft className="w-5 h-5" /> Quay Lại
                        </Link>
                        <Link href="/history"
                            className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all hover:scale-105 shadow-md">
                            <History className="w-5 h-5" /> Xem Lịch Sử
                        </Link>
                        <Link href={`/tests/${testId}`}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all hover:scale-105 shadow-md">
                            <RefreshCw className="w-5 h-5" /> Làm Lại Bài Thi
                        </Link>
                        <Link href="/tests"
                            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all hover:scale-105 shadow-md">
                            <Home className="w-5 h-5" /> Danh Sách Đề Thi
                        </Link>
                    </div>
                </div>

                {/* ── Question Review ── */}
                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                            <History className="w-7 h-7 text-blue-600" />
                            Xem Lại Chi Tiết
                        </h2>
                        <button onClick={() => setShowReview(!showReview)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all hover:scale-105 shadow-md">
                            {showReview ? (
                                <><EyeOff className="w-5 h-5" /><span className="hidden md:inline">Ẩn Chi Tiết</span></>
                            ) : (
                                <><Eye className="w-5 h-5" /><span className="hidden md:inline">Hiện Chi Tiết</span></>
                            )}
                        </button>
                    </div>

                    {showReview && (
                        <div className="space-y-8">
                            {Array.isArray(result.answers) && result.answers.map((answer: AnswerRecord, index: number) => {
                                const question = questionMap.get(answer.questionId);
                                if (!question) return null;

                                const isCorrect = answer.isCorrect;
                                const hasPassage = !!question.groupId && !!question.groupPassage;

                                // Only show group header once per group (first question in the group)
                                const currentIdx = Array.isArray(result.answers)
                                    ? result.answers.findIndex((a: AnswerRecord) => a.questionId === answer.questionId)
                                    : -1;
                                const prevAnswer = currentIdx > 0
                                    ? result.answers[currentIdx - 1] as AnswerRecord
                                    : null;
                                const prevQuestion = prevAnswer ? questionMap.get(prevAnswer.questionId) : null;
                                const isFirstInGroup = hasPassage && (
                                    !prevQuestion?.groupId || prevQuestion.groupId !== question.groupId
                                );

                                return (
                                    <div key={answer.questionId}>
                                        {/* Passage header (shown once per group) */}
                                        {isFirstInGroup && (
                                            <div className="mb-4 bg-blue-50 border border-blue-200 rounded-xl p-5">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <BookOpen className="w-5 h-5 text-blue-600" />
                                                    {question.groupTitle && (
                                                        <p className="text-sm font-semibold text-blue-700 italic">{question.groupTitle}</p>
                                                    )}
                                                </div>
                                                {question.groupImageUrl && (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img src={question.groupImageUrl} alt="Passage" className="rounded-lg mb-3 max-h-48 object-contain" />
                                                )}
                                                {question.groupAudioUrl && (
                                                    // eslint-disable-next-line jsx-a11y/media-has-caption
                                                    <audio controls className="w-full mb-3" src={question.groupAudioUrl} />
                                                )}
                                                {question.groupPassage && (
                                                    <pre className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap font-sans bg-white rounded-lg p-4 border border-blue-100">
                                                        {question.groupPassage}
                                                    </pre>
                                                )}
                                            </div>
                                        )}

                                        {/* Question card */}
                                        <div className={`border-2 rounded-xl p-6 transition-all ${isCorrect ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'}`}>
                                            <div className="flex items-start gap-4 mb-4">
                                                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                                                    {isCorrect ? <CheckCircle className="w-6 h-6 text-white" /> : <XCircle className="w-6 h-6 text-white" />}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <span className="font-bold text-gray-700">Câu {index + 1}</span>
                                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${isCorrect ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                                                            {isCorrect ? 'Đúng' : 'Sai'}
                                                        </span>
                                                        {hasPassage && (
                                                            <span className="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700 flex items-center gap-1">
                                                                <BookOpen className="w-3 h-3" /> Đọc hiểu
                                                            </span>
                                                        )}
                                                    </div>

                                                    {question.content && (
                                                        <p className="text-gray-800 mb-4 leading-relaxed">{question.content}</p>
                                                    )}

                                                    {question.imageUrl && (
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        <img src={question.imageUrl} alt="" className="mb-3 rounded-lg max-h-40 object-contain" />
                                                    )}

                                                    <div className="space-y-2 mb-4">
                                                        {Object.entries(question.options || {}).map(([key, value]) => {
                                                            const isUserAnswer = answer.selectedOption === key;
                                                            const isCorrectAnswer = answer.correctOption === key;
                                                            return (
                                                                <div key={key}
                                                                    className={`p-3 rounded-lg border-2 ${isCorrectAnswer
                                                                        ? 'border-green-500 bg-green-100'
                                                                        : isUserAnswer
                                                                            ? 'border-red-500 bg-red-100'
                                                                            : 'border-gray-200 bg-white'}`}>
                                                                    <div className="flex items-center gap-3">
                                                                        {isCorrectAnswer && <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />}
                                                                        {!isCorrectAnswer && isUserAnswer && <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />}
                                                                        <span className="font-semibold text-gray-700 w-5 flex-shrink-0">{key}.</span>
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
