'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import { getTestById, startTestSession, submitTestSession } from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Clock, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';

const DEMO_USER_ID = '63fec151-3dfc-496d-8281-ba236a57b1d3';

export default function TakeTestPage() {
    const params = useParams();
    const router = useRouter();
    const testId = params.id as string;

    const [sessionId, setSessionId] = useState<string | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data: test, isLoading } = useQuery({
        queryKey: ['test', testId],
        queryFn: () => getTestById(testId),
    });

    const startMutation = useMutation({
        mutationFn: () => startTestSession(DEMO_USER_ID, testId),
        onSuccess: (data) => {
            setSessionId(data.sessionId);
            setTimeRemaining(data.duration);
        },
    });

    const submitMutation = useMutation({
        mutationFn: async () => {
            if (!sessionId) throw new Error('No session');
            const answerArray = Object.entries(answers).map(([questionId, selectedOption]) => ({
                questionId,
                selectedOption,
            }));
            const durationTaken = test!.duration - timeRemaining;
            return submitTestSession(sessionId, answerArray, durationTaken);
        },
        onSuccess: (data) => {
            router.push(`/results/${data.sessionId}`);
        },
    });

    // Timer countdown
    useEffect(() => {
        if (timeRemaining > 0 && sessionId) {
            const timer = setInterval(() => {
                setTimeRemaining((prev) => {
                    if (prev <= 1) {
                        handleSubmit();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [timeRemaining, sessionId]);

    const handleSubmit = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        submitMutation.mutate();
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">Đang tải...</div>
            </div>
        );
    }

    if (!test) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-red-500">Không tìm thấy đề thi</div>
            </div>
        );
    }

    if (!sessionId) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-8">
                <div className="bg-white rounded-xl shadow-xl p-12 max-w-2xl text-center">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">{test.title}</h1>
                    <p className="text-gray-600 mb-2">Thời gian: {Math.floor(test.duration / 60)} phút</p>
                    <p className="text-gray-600 mb-8">
                        Số câu hỏi: {test.parts?.reduce((sum: number, p: any) => sum + p.questions.length, 0)}
                    </p>
                    <button
                        onClick={() => startMutation.mutate()}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all hover:scale-105 shadow-lg"
                    >
                        Bắt đầu làm bài
                    </button>
                </div>
            </div>
        );
    }

    const allQuestions = test.parts?.flatMap((p: any) => p.questions) || [];
    const currentQuestion = allQuestions[currentQuestionIndex];
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header with Timer */}
            <div className="bg-white shadow-md sticky top-0 z-10">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <h1 className="text-xl font-bold text-gray-800">{test.title}</h1>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-lg font-semibold">
                            <Clock className={`w-6 h-6 ${timeRemaining < 300 ? 'text-red-500' : 'text-blue-600'}`} />
                            <span className={timeRemaining < 300 ? 'text-red-500' : 'text-gray-800'}>
                                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                            </span>
                        </div>
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50"
                        >
                            Nộp bài
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto p-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Question Navigator */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-md p-4 sticky top-24">
                            <h3 className="font-bold text-gray-800 mb-4">Danh sách câu hỏi</h3>
                            <div className="grid grid-cols-5 lg:grid-cols-4 gap-2">
                                {allQuestions.map((q: any, idx: number) => (
                                    <button
                                        key={q.id}
                                        onClick={() => setCurrentQuestionIndex(idx)}
                                        className={`w-10 h-10 rounded-lg font-semibold transition-all ${idx === currentQuestionIndex
                                            ? 'bg-blue-600 text-white'
                                            : answers[q.id]
                                                ? 'bg-green-100 text-green-700 border-2 border-green-500'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        {idx + 1}
                                    </button>
                                ))}
                            </div>
                            <div className="mt-4 text-sm text-gray-600">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-4 h-4 bg-green-100 border-2 border-green-500 rounded"></div>
                                    <span>Đã trả lời</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-gray-100 rounded"></div>
                                    <span>Chưa trả lời</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Question Content */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-xl shadow-md p-8">
                            <div className="mb-6">
                                <span className="text-sm text-gray-500">
                                    Câu {currentQuestionIndex + 1} / {allQuestions.length}
                                </span>
                                <h2 className="text-2xl font-bold text-gray-800 mt-2">
                                    {currentQuestion.content}
                                </h2>
                            </div>

                            <div className="space-y-3">
                                {Object.entries(currentQuestion.options).map(([key, value]) => (
                                    <button
                                        key={key}
                                        onClick={() => setAnswers({ ...answers, [currentQuestion.id]: key })}
                                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${answers[currentQuestion.id] === key
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${answers[currentQuestion.id] === key
                                                    ? 'border-blue-500 bg-blue-500'
                                                    : 'border-gray-300'
                                                    }`}
                                            >
                                                {answers[currentQuestion.id] === key && (
                                                    <CheckCircle2 className="w-4 h-4 text-white" />
                                                )}
                                            </div>
                                            <span className="font-semibold text-gray-700">{key}.</span>
                                            <span className="text-gray-800">{value as string}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {/* Navigation */}
                            <div className="flex items-center justify-between mt-8 pt-6 border-t">
                                <button
                                    onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                                    disabled={currentQuestionIndex === 0}
                                    className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                    Câu trước
                                </button>
                                <button
                                    onClick={() =>
                                        setCurrentQuestionIndex(Math.min(allQuestions.length - 1, currentQuestionIndex + 1))
                                    }
                                    disabled={currentQuestionIndex === allQuestions.length - 1}
                                    className="flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Câu sau
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
