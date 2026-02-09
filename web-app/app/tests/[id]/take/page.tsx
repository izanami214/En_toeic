'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getTestById, submitTestSession } from '@/lib/api';
import { Clock, ChevronLeft, ChevronRight, CheckCircle, Flag, Menu, X } from 'lucide-react';

export default function TakeExamPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const testId = params.id as string;
    const sessionId = searchParams.get('sessionId');

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPalette, setShowPalette] = useState(false); // Mobile toggle

    const { data: test, isLoading, error } = useQuery({
        queryKey: ['test', testId],
        queryFn: () => getTestById(testId),
    });

    // Flatten questions for easier navigation
    const allQuestions = test?.parts?.flatMap((part: any) => part.questions) || [];
    const currentQuestion = allQuestions[currentQuestionIndex];

    // Initialize Timer
    useEffect(() => {
        if (test && timeLeft === null) {
            setTimeLeft(test.duration);
        }
    }, [test, timeLeft]);

    // Timer Countdown
    useEffect(() => {
        if (timeLeft === null || timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev !== null && prev <= 1) {
                    clearInterval(timer);
                    handleSubmit(true); // Auto submit
                    return 0;
                }
                return prev !== null ? prev - 1 : 0;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    // Format Time
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleAnswer = (questionId: string, option: string) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: option,
        }));
    };

    const handleSubmit = async (auto = false) => {
        if (!sessionId) {
            alert('Lỗi: Không tìm thấy phiên làm bài (Session ID missing).');
            return;
        }

        if (!auto && !confirm('Bạn có chắc chắn muốn nộp bài?')) return;

        setIsSubmitting(true);
        try {
            const formattedAnswers = Object.entries(answers).map(([qId, opt]) => ({
                questionId: qId,
                selectedOption: opt,
            }));

            const durationTaken = test.duration - (timeLeft || 0);

            await submitTestSession(sessionId, formattedAnswers, durationTaken);
            // Redirect to result page to show score
            router.push(`/tests/${testId}/result/${sessionId}`);
        } catch (error) {
            console.error('Submit error:', error);
            alert('Có lỗi xảy ra khi nộp bài.');
            setIsSubmitting(false);
        }
    };

    const handleExit = () => {
        if (confirm('Bạn có chắc chắn muốn thoát? Tiến trình làm bài sẽ không được lưu.')) {
            router.push(`/tests/${testId}`);
        }
    };

    if (isLoading) return <div className="text-center p-8">Đang tải đề thi...</div>;
    if (error || !test) return <div className="text-center p-8 text-red-500">Không tải được đề thi.</div>;

    const progress = (Object.keys(answers).length / allQuestions.length) * 100;

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b px-6 py-3 flex items-center justify-between shadow-sm z-10">
                <div className="flex items-center gap-4">
                    <h1 className="font-bold text-gray-800 hidden md:block">{test.title}</h1>
                    <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                        {test.type}
                    </span>
                </div>

                <div className="flex items-center gap-6">
                    <button
                        onClick={handleExit}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        <X className="w-5 h-5" />
                        <span className="hidden md:inline">Thoát</span>
                    </button>

                    <div className={`flex items-center gap-2 font-mono text-xl font-bold ${timeLeft && timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-blue-600'}`}>
                        <Clock className="w-5 h-5" />
                        {timeLeft !== null ? formatTime(timeLeft) : '--:--'}
                    </div>

                    <button
                        onClick={() => handleSubmit(false)}
                        disabled={isSubmitting}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-70"
                    >
                        {isSubmitting ? 'Đang nộp...' : 'Nộp bài'}
                    </button>

                    <button onClick={() => setShowPalette(!showPalette)} className="md:hidden text-gray-500">
                        <Menu />
                    </button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar / Question Palette */}
                <aside className={`bg-white border-r w-72 flex-col absolute md:relative h-full z-20 transition-transform transform ${showPalette ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
                    <div className="p-4 border-b bg-gray-50">
                        <h3 className="font-semibold text-gray-700 mb-2">Danh sách câu hỏi</h3>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 text-right">{Object.keys(answers).length}/{allQuestions.length} đã làm</p>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4">
                        <div className="grid grid-cols-5 gap-2">
                            {allQuestions.map((q: any, idx: number) => {
                                const isAnswered = !!answers[q.id];
                                const isCurrent = idx === currentQuestionIndex;
                                return (
                                    <button
                                        key={q.id}
                                        onClick={() => {
                                            setCurrentQuestionIndex(idx);
                                            setShowPalette(false);
                                        }}
                                        className={`w-10 h-10 rounded-lg text-sm font-medium flex items-center justify-center transition-all ${isCurrent ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-300' :
                                            isAnswered ? 'bg-blue-100 text-blue-700' :
                                                'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        {idx + 1}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-6 md:p-10 scroll-smooth">
                    <div className="max-w-3xl mx-auto">
                        {/* Part Header (if needed to display part context) */}
                        <div className="mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                            <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                                Question {currentQuestionIndex + 1} of {allQuestions.length}
                            </span>
                        </div>

                        {/* Question Card */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden min-h-[400px]">
                            <div className="p-8">
                                <p className="text-lg text-gray-800 leading-relaxed font-medium mb-8">
                                    {currentQuestion.content}
                                </p>

                                <div className="space-y-4">
                                    {Object.entries(currentQuestion.options).map(([key, value]) => (
                                        <label
                                            key={key}
                                            className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all hover:bg-gray-50 ${answers[currentQuestion.id] === key
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200'
                                                }`}
                                        >
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${answers[currentQuestion.id] === key
                                                ? 'border-blue-600 bg-blue-600'
                                                : 'border-gray-300'
                                                }`}>
                                                {answers[currentQuestion.id] === key && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                                            </div>
                                            <input
                                                type="radio"
                                                name={`question-${currentQuestion.id}`}
                                                value={key}
                                                checked={answers[currentQuestion.id] === key}
                                                onChange={() => handleAnswer(currentQuestion.id, key)}
                                                className="hidden"
                                            />
                                            <span className="font-bold text-gray-700 w-6">{key}.</span>
                                            <span className="text-gray-800 flex-1">{value as string}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Navigation Footer */}
                            <div className="bg-gray-50 px-8 py-6 border-t flex justify-between items-center">
                                <button
                                    onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                                    disabled={currentQuestionIndex === 0}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-gray-600 hover:bg-white hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                    Previous
                                </button>

                                <button
                                    onClick={() => setCurrentQuestionIndex(prev => Math.min(allQuestions.length - 1, prev + 1))}
                                    disabled={currentQuestionIndex === allQuestions.length - 1}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    Next
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
