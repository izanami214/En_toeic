'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getTestById, submitTestSession } from '@/lib/api';
import { Clock, ChevronLeft, ChevronRight, Menu, X, BookOpen } from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────
interface QuestionOption { A: string; B: string; C: string; D: string }

interface FlatQuestion {
    id: string;
    content?: string;
    options: QuestionOption;
    correctOpt: string;
    explanation?: string;
    imageUrl?: string;
    // Group context (if part of a reading/listening group)
    groupId?: string;
    groupTitle?: string;
    groupPassage?: string;
    groupImageUrl?: string;
    groupAudioUrl?: string;
}

// ── Helpers ────────────────────────────────────────────────────────
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
        // Standalone questions
        for (const q of part.questions ?? []) {
            result.push({ ...q });
        }
        // Group questions — attach group context
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

function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

// ── Component ──────────────────────────────────────────────────────
export default function TakeExamPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const testId = params.id as string;
    const sessionId = searchParams.get('sessionId');

    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPalette, setShowPalette] = useState(false);

    const { data: test, isLoading, error } = useQuery({
        queryKey: ['test', testId],
        queryFn: () => getTestById(testId),
    });

    // Flatten once; memoize so we don't recalculate on every render
    const allQuestions = useMemo(() => (test ? flattenQuestions(test) : []), [test]);
    const currentQuestion = allQuestions[currentIndex];
    const isGroupQuestion = !!currentQuestion?.groupId;

    // Init timer
    useEffect(() => {
        if (test && timeLeft === null) setTimeLeft(test.duration);
    }, [test, timeLeft]);

    const handleAnswer = (qId: string, opt: string) =>
        setAnswers(prev => ({ ...prev, [qId]: opt }));

    async function handleSubmit(auto = false) {
        if (!sessionId) { alert('Session ID không hợp lệ.'); return; }
        if (!auto && !confirm('Bạn có chắc chắn muốn nộp bài?')) return;
        setIsSubmitting(true);
        try {
            const formatted = Object.entries(answers).map(([qId, opt]) => ({
                questionId: qId, selectedOption: opt,
            }));
            const durationTaken = (test?.duration ?? 0) - (timeLeft ?? 0);
            await submitTestSession(sessionId, formatted, durationTaken);
            router.push(`/tests/${testId}/result/${sessionId}`);
        } catch (err) {
            console.error('Submit error:', err);
            alert('Có lỗi xảy ra khi nộp bài.');
            setIsSubmitting(false);
        }
    }

    // Countdown timer
    useEffect(() => {
        if (timeLeft === null || timeLeft <= 0) return;
        const t = setInterval(() => {
            setTimeLeft(prev => {
                if (prev !== null && prev <= 1) { clearInterval(t); handleSubmit(true); return 0; }
                return prev !== null ? prev - 1 : 0;
            });
        }, 1000);
        return () => clearInterval(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timeLeft]);

    if (isLoading) return <div className="flex items-center justify-center h-screen text-gray-600">Đang tải đề thi...</div>;
    if (error || !test) return <div className="flex items-center justify-center h-screen text-red-500">Không tải được đề thi.</div>;

    const progress = allQuestions.length > 0 ? (Object.keys(answers).length / allQuestions.length) * 100 : 0;

    return (
        <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
            {/* ── Top Header ── */}
            <header className="bg-white border-b px-6 py-3 flex items-center justify-between shadow-sm z-10 flex-shrink-0">
                <div className="flex items-center gap-3">
                    <h1 className="font-bold text-gray-800 hidden md:block truncate max-w-xs">{test.title}</h1>
                    <span className="text-sm bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">{test.type}</span>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={() => { if (confirm('Thoát sẽ mất tiến trình làm bài?')) router.push(`/tests/${testId}`); }}
                        className="flex items-center gap-1 text-gray-500 hover:text-gray-800 transition-colors text-sm">
                        <X className="w-4 h-4" /><span className="hidden md:inline">Thoát</span>
                    </button>
                    <div className={`flex items-center gap-2 font-mono text-lg font-bold tabular-nums ${timeLeft && timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-blue-600'}`}>
                        <Clock className="w-4 h-4" />
                        {timeLeft !== null ? formatTime(timeLeft) : '--:--'}
                    </div>
                    <button onClick={() => handleSubmit(false)} disabled={isSubmitting}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold transition-colors disabled:opacity-60 text-sm">
                        {isSubmitting ? 'Đang nộp...' : 'Nộp bài'}
                    </button>
                    <button onClick={() => setShowPalette(!showPalette)} className="md:hidden text-gray-500">
                        <Menu className="w-5 h-5" />
                    </button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* ── Left Sidebar: Question Palette ── */}
                <aside className={`bg-white border-r w-64 flex-col absolute md:relative h-full z-20 transition-transform ${showPalette ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 flex`}>
                    <div className="p-4 border-b bg-gray-50 flex-shrink-0">
                        <h3 className="font-semibold text-gray-700 mb-2 text-sm">Danh sách câu hỏi</h3>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div className="bg-blue-500 h-1.5 rounded-full transition-all" style={{ width: `${progress}%` }} />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{Object.keys(answers).length}/{allQuestions.length} đã làm</p>
                    </div>
                    <div className="flex-1 overflow-y-auto p-3">
                        <div className="grid grid-cols-5 gap-1.5">
                            {allQuestions.map((q, idx) => {
                                const isAnswered = !!answers[q.id];
                                const isCurrent = idx === currentIndex;
                                const hasGroup = !!q.groupId;
                                return (
                                    <button key={q.id} onClick={() => { setCurrentIndex(idx); setShowPalette(false); }}
                                        title={hasGroup ? 'Câu hỏi đọc hiểu' : ''}
                                        className={`w-10 h-10 rounded-lg text-xs font-semibold flex items-center justify-center transition-all relative
                                            ${isCurrent ? 'bg-blue-600 text-white ring-2 ring-blue-300 shadow' :
                                                isAnswered ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                                        {idx + 1}
                                        {hasGroup && <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full" />}
                                    </button>
                                );
                            })}
                        </div>
                        <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-400 rounded-full inline-block" /> = câu đọc hiểu
                        </p>
                    </div>
                </aside>

                {/* ── Main Content ── */}
                <main className="flex-1 overflow-hidden flex flex-col md:flex-row">
                    {isGroupQuestion ? (
                        // ── SPLIT SCREEN for reading/listening passages ──
                        <>
                            {/* Left: Passage */}
                            <div className="md:w-1/2 overflow-y-auto p-6 border-r bg-white">
                                <div className="max-w-prose mx-auto">
                                    {currentQuestion.groupTitle && (
                                        <p className="text-sm font-semibold text-blue-600 mb-4 italic">{currentQuestion.groupTitle}</p>
                                    )}
                                    {currentQuestion.groupImageUrl && (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={currentQuestion.groupImageUrl} alt="Passage image" className="w-full rounded-lg mb-4 shadow" />
                                    )}
                                    {currentQuestion.groupAudioUrl && (
                                        <div className="mb-4">
                                            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                                            <audio controls className="w-full" src={currentQuestion.groupAudioUrl} />
                                        </div>
                                    )}
                                    {currentQuestion.groupPassage && (
                                        <div className="prose prose-sm max-w-none text-gray-800 leading-relaxed whitespace-pre-wrap bg-gray-50 rounded-xl p-5 border border-gray-200">
                                            {currentQuestion.groupPassage}
                                        </div>
                                    )}
                                </div>
                            </div>
                            {/* Right: Question */}
                            <div className="md:w-1/2 overflow-y-auto p-6">
                                <QuestionPanel
                                    question={currentQuestion}
                                    index={currentIndex}
                                    total={allQuestions.length}
                                    selectedAnswer={answers[currentQuestion.id]}
                                    onAnswer={(opt) => handleAnswer(currentQuestion.id, opt)}
                                    onPrev={() => setCurrentIndex(p => Math.max(0, p - 1))}
                                    onNext={() => setCurrentIndex(p => Math.min(allQuestions.length - 1, p + 1))}
                                    isFirst={currentIndex === 0}
                                    isLast={currentIndex === allQuestions.length - 1}
                                    isGroupQuestion
                                />
                            </div>
                        </>
                    ) : (
                        // ── SINGLE COLUMN for standalone questions ──
                        <div className="flex-1 overflow-y-auto p-6 md:p-10">
                            <div className="max-w-3xl mx-auto">
                                <QuestionPanel
                                    question={currentQuestion}
                                    index={currentIndex}
                                    total={allQuestions.length}
                                    selectedAnswer={answers[currentQuestion?.id]}
                                    onAnswer={(opt) => currentQuestion && handleAnswer(currentQuestion.id, opt)}
                                    onPrev={() => setCurrentIndex(p => Math.max(0, p - 1))}
                                    onNext={() => setCurrentIndex(p => Math.min(allQuestions.length - 1, p + 1))}
                                    isFirst={currentIndex === 0}
                                    isLast={currentIndex === allQuestions.length - 1}
                                    isGroupQuestion={false}
                                />
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

// ── Sub-component: Question Panel (shared between both layouts) ──
interface QuestionPanelProps {
    question: FlatQuestion;
    index: number;
    total: number;
    selectedAnswer?: string;
    onAnswer: (opt: string) => void;
    onPrev: () => void;
    onNext: () => void;
    isFirst: boolean;
    isLast: boolean;
    isGroupQuestion: boolean;
}

function QuestionPanel({ question, index, total, selectedAnswer, onAnswer, onPrev, onNext, isFirst, isLast, isGroupQuestion }: QuestionPanelProps) {
    if (!question) return null;
    return (
        <div className={`flex flex-col ${isGroupQuestion ? 'h-full' : ''}`}>
            <div className="mb-4 flex items-center gap-2">
                {isGroupQuestion && <BookOpen className="w-4 h-4 text-blue-500 flex-shrink-0" />}
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Câu {index + 1} / {total}
                </span>
            </div>

            <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col ${isGroupQuestion ? 'flex-1' : ''}`}>
                <div className="p-6 flex-1">
                    {question.content && (
                        <p className="text-base text-gray-800 font-medium mb-6 leading-relaxed">{question.content}</p>
                    )}
                    {question.imageUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={question.imageUrl} alt="" className="mb-4 rounded-lg max-h-48 object-contain" />
                    )}

                    <div className="space-y-3">
                        {Object.entries(question.options).map(([key, value]) => (
                            <label key={key}
                                className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all hover:bg-gray-50
                                    ${selectedAnswer === key ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0
                                    ${selectedAnswer === key ? 'border-blue-600 bg-blue-600' : 'border-gray-300'}`}>
                                    {selectedAnswer === key && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                                </div>
                                <input type="radio" name={`q-${question.id}`} value={key}
                                    checked={selectedAnswer === key} onChange={() => onAnswer(key)} className="hidden" />
                                <span className="font-bold text-gray-700 w-5 flex-shrink-0">{key}.</span>
                                <span className="text-gray-800">{value as string}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="bg-gray-50 px-6 py-4 border-t flex justify-between">
                    <button onClick={onPrev} disabled={isFirst}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-gray-600 hover:bg-white hover:shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                        <ChevronLeft className="w-4 h-4" /> Câu trước
                    </button>
                    <button onClick={onNext} disabled={isLast}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 shadow disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                        Câu tiếp <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
