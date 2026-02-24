'use client';

import { useQuery } from '@tanstack/react-query';
import { getTestById, startTestSession } from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Clock, PlayCircle, Eye, EyeOff, BookOpen, FileText, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '@/lib/auth-store';

// ── Types ──────────────────────────────────────────────────────────
interface Question {
    id: string;
    content?: string;
    options: Record<string, string>;
    correctOpt: string;
    explanation?: string;
    imageUrl?: string;
    audioUrl?: string;
}

interface QuestionGroup {
    id: string;
    title?: string;
    passage?: string;
    imageUrl?: string;
    audioUrl?: string;
    questions: Question[];
}

interface Part {
    id: string;
    partNumber: number;
    questions?: Question[];
    groups?: QuestionGroup[];
}

// ── Sub-component: Single Question Card ──────────────────────────
function QuestionCard({
    question,
    index,
    showAnswer,
}: {
    question: Question;
    index: number;
    showAnswer: boolean;
}) {
    return (
        <div className="border border-gray-200 rounded-xl p-5 bg-white hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-sm">
                    {index}
                </span>
                <div className="flex-1">
                    {question.content && (
                        <p className="text-gray-800 mb-4 leading-relaxed font-medium">{question.content}</p>
                    )}
                    {question.imageUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={question.imageUrl} alt="" className="mb-3 rounded-lg max-h-40 object-contain" />
                    )}
                    {question.audioUrl && (
                        // eslint-disable-next-line jsx-a11y/media-has-caption
                        <audio controls src={question.audioUrl} className="mb-3 w-full" />
                    )}

                    <div className="grid grid-cols-1 gap-2">
                        {Object.entries(question.options).map(([key, value]) => {
                            const isCorrect = key === question.correctOpt;
                            return (
                                <div key={key}
                                    className={`p-3 rounded-lg border-2 transition-all ${showAnswer && isCorrect
                                        ? 'border-green-500 bg-green-50'
                                        : 'border-gray-200 bg-gray-50'}`}>
                                    <div className="flex items-center gap-3">
                                        {showAnswer && isCorrect
                                            ? <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                                            : <span className="w-4 h-4 flex-shrink-0" />
                                        }
                                        <span className="font-bold text-gray-600 w-5">{key}.</span>
                                        <span className="text-gray-800">{value}</span>
                                        {showAnswer && isCorrect && (
                                            <span className="ml-auto text-xs text-green-600 font-semibold">✓ Đúng</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {showAnswer && question.explanation && (
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
}

// ── Main Page ─────────────────────────────────────────────────────
export default function TestDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuthStore();
    const testId = params.id as string;

    const [isStarting, setIsStarting] = useState(false);
    const [showAnswer, setShowAnswer] = useState(false);

    const { data: test, isLoading, error } = useQuery({
        queryKey: ['test', testId],
        queryFn: () => getTestById(testId),
    });

    const handleStartTest = async () => {
        if (isStarting) return;
        if (!user?.id) { alert('Vui lòng đăng nhập để làm bài thi.'); return; }
        setIsStarting(true);
        try {
            const data = await startTestSession(user.id, testId);
            router.push(`/tests/${testId}/take?sessionId=${data.sessionId}`);
        } catch (e) {
            console.error(e);
            alert('Có lỗi xảy ra. Vui lòng thử lại.');
            setIsStarting(false);
        }
    };

    if (isLoading) return <div className="flex items-center justify-center min-h-screen text-gray-600">Đang tải...</div>;
    if (error || !test) return <div className="flex items-center justify-center min-h-screen text-red-500">Không tìm thấy đề thi</div>;

    // Count total questions across standalone + groups
    const totalQuestions = (test.parts as Part[] || []).reduce((sum: number, part: Part) => {
        const standalone = (part.questions ?? []).length;
        const grouped = (part.groups ?? []).reduce((s: number, g: QuestionGroup) => s + g.questions.length, 0);
        return sum + standalone + grouped;
    }, 0);

    let globalIndex = 0; // global counter across parts

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Back */}
                <button onClick={() => router.back()}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 transition-colors">
                    <ArrowLeft className="w-5 h-5" /> Quay lại
                </button>

                {/* ── Header Card ── */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-8">
                        <h1 className="text-3xl font-bold text-white mb-3">{test.title}</h1>
                        <div className="flex flex-wrap items-center gap-4 text-white/90 mb-6">
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5" />
                                <span>{Math.floor(test.duration / 60)} phút</span>
                            </div>
                            <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">{test.type}</span>
                            <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                                {totalQuestions} câu hỏi
                            </span>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <button onClick={handleStartTest} disabled={isStarting}
                                className="flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-all hover:scale-105 shadow-lg disabled:opacity-70">
                                <PlayCircle className="w-5 h-5" />
                                {isStarting ? 'Đang tạo bài thi...' : 'Bắt đầu làm bài'}
                            </button>

                            <button onClick={() => setShowAnswer(!showAnswer)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all hover:scale-105 shadow-lg border-2
                                    ${showAnswer
                                        ? 'bg-yellow-400 text-yellow-900 border-yellow-400 hover:bg-yellow-300'
                                        : 'bg-white/10 text-white border-white/40 hover:bg-white/20'}`}>
                                {showAnswer
                                    ? <><EyeOff className="w-5 h-5" /> Ẩn đáp án</>
                                    : <><Eye className="w-5 h-5" /> Hiện đáp án</>
                                }
                            </button>
                        </div>
                    </div>

                    {/* Stats row */}
                    <div className="grid grid-cols-3 divide-x border-t bg-gray-50">
                        <div className="p-4 text-center">
                            <div className="text-2xl font-bold text-blue-600">{(test.parts as Part[])?.length ?? 0}</div>
                            <div className="text-xs text-gray-500 mt-1">Phần thi</div>
                        </div>
                        <div className="p-4 text-center">
                            <div className="text-2xl font-bold text-indigo-600">{totalQuestions}</div>
                            <div className="text-xs text-gray-500 mt-1">Câu hỏi</div>
                        </div>
                        <div className="p-4 text-center">
                            <div className="text-2xl font-bold text-green-600">{Math.floor(test.duration / 60)}</div>
                            <div className="text-xs text-gray-500 mt-1">Phút</div>
                        </div>
                    </div>
                </div>

                {/* ── Parts & Questions ── */}
                <div className="space-y-10">
                    {(test.parts as Part[] || []).map((part: Part) => (
                        <div key={part.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                            {/* Part Header */}
                            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
                                <h2 className="text-xl font-bold text-white">
                                    Part {part.partNumber}
                                </h2>
                                <p className="text-indigo-100 text-sm mt-0.5">
                                    {(part.questions?.length ?? 0) + (part.groups?.reduce((s: number, g: QuestionGroup) => s + g.questions.length, 0) ?? 0)} câu hỏi
                                </p>
                            </div>

                            <div className="p-6 space-y-5">
                                {/* Standalone Questions */}
                                {(part.questions ?? []).map((q: Question) => {
                                    globalIndex++;
                                    return (
                                        <QuestionCard key={q.id} question={q} index={globalIndex} showAnswer={showAnswer} />
                                    );
                                })}

                                {/* Question Groups (with passage) */}
                                {(part.groups ?? []).map((group: QuestionGroup) => (
                                    <div key={group.id} className="border-2 border-blue-200 rounded-2xl overflow-hidden">
                                        {/* Passage header */}
                                        <div className="bg-blue-50 px-5 py-4 border-b border-blue-200">
                                            <div className="flex items-center gap-2 mb-2">
                                                <BookOpen className="w-4 h-4 text-blue-600" />
                                                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Đoạn văn đọc hiểu</span>
                                            </div>
                                            {group.title && (
                                                <p className="text-sm font-semibold text-blue-800 italic mb-3">{group.title}</p>
                                            )}
                                            {group.imageUrl && (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={group.imageUrl} alt="Passage" className="rounded-lg mb-3 max-h-48 object-contain" />
                                            )}
                                            {group.audioUrl && (
                                                // eslint-disable-next-line jsx-a11y/media-has-caption
                                                <audio controls src={group.audioUrl} className="w-full mb-3" />
                                            )}
                                            {group.passage && (
                                                <pre className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap font-sans bg-white rounded-xl p-4 border border-blue-100 max-h-80 overflow-y-auto">
                                                    {group.passage}
                                                </pre>
                                            )}
                                        </div>

                                        {/* Questions in group */}
                                        <div className="p-5 space-y-4">
                                            <div className="flex items-center gap-2 text-gray-500">
                                                <FileText className="w-4 h-4" />
                                                <span className="text-sm font-medium">{group.questions.length} câu hỏi cho đoạn văn này</span>
                                            </div>
                                            {group.questions.map((q: Question) => {
                                                globalIndex++;
                                                return (
                                                    <QuestionCard key={q.id} question={q} index={globalIndex} showAnswer={showAnswer} />
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Floating start button */}
                <div className="mt-8 flex justify-center">
                    <button onClick={handleStartTest} disabled={isStarting}
                        className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all disabled:opacity-70 shadow-lg">
                        <PlayCircle className="w-6 h-6" />
                        {isStarting ? 'Đang tạo bài thi...' : 'Bắt đầu làm bài'}
                    </button>
                </div>
            </div>
        </div>
    );
}
