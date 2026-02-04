'use client';

import { useQuery } from '@tanstack/react-query';
import { getSessionResult } from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Trophy, Clock, CheckCircle, XCircle, Home } from 'lucide-react';

export default function ResultPage() {
    const params = useParams();
    const router = useRouter();
    const sessionId = params.id as string;

    const { data: result, isLoading } = useQuery({
        queryKey: ['result', sessionId],
        queryFn: () => getSessionResult(sessionId),
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">Đang tải kết quả...</div>
            </div>
        );
    }

    if (!result) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-red-500">Không tìm thấy kết quả</div>
            </div>
        );
    }

    const correctCount = result.answers.filter((a: any) => a.isCorrect).length;
    const totalQuestions = result.answers.length;
    const accuracy = Math.round((correctCount / totalQuestions) * 100);
    const minutes = Math.floor(result.durationTaken / 60);
    const seconds = result.durationTaken % 60;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
            <div className="max-w-4xl mx-auto">
                {/* Score Card */}
                <div className="bg-white rounded-xl shadow-2xl overflow-hidden mb-8">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-12 text-center">
                        <Trophy className="w-20 h-20 mx-auto mb-4 text-yellow-300" />
                        <h1 className="text-4xl font-bold text-white mb-2">Kết Quả Bài Thi</h1>
                        <p className="text-xl text-blue-100">{result.testTitle}</p>
                    </div>

                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-center">
                                <div className="text-5xl font-bold text-blue-600 mb-2">{result.score || 0}</div>
                                <div className="text-gray-600">Điểm TOEIC</div>
                            </div>

                            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 text-center">
                                <div className="text-5xl font-bold text-green-600 mb-2">{accuracy}%</div>
                                <div className="text-gray-600">Độ chính xác</div>
                            </div>

                            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 text-center">
                                <div className="text-5xl font-bold text-purple-600 mb-2">
                                    {minutes}:{String(seconds).padStart(2, '0')}
                                </div>
                                <div className="text-gray-600">Thời gian</div>
                            </div>
                        </div>

                        <div className="flex items-center justify-center gap-8 mb-8">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                                <span className="text-lg">
                                    <strong>{correctCount}</strong> câu đúng
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <XCircle className="w-6 h-6 text-red-600" />
                                <span className="text-lg">
                                    <strong>{totalQuestions - correctCount}</strong> câu sai
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-4 justify-center">
                            <Link
                                href="/"
                                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold transition-colors"
                            >
                                <Home className="w-5 h-5" />
                                Về trang chủ
                            </Link>
                            <button
                                onClick={() => router.back()}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                            >
                                Xem lại đáp án
                            </button>
                        </div>
                    </div>
                </div>

                {/* Answer Details */}
                <div className="bg-white rounded-xl shadow-xl p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Chi Tiết Đáp Án</h2>
                    <div className="space-y-4">
                        {result.answers.map((answer: any, idx: number) => (
                            <div
                                key={idx}
                                className={`p-4 rounded-lg border-2 ${answer.isCorrect
                                        ? 'border-green-200 bg-green-50'
                                        : 'border-red-200 bg-red-50'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold text-gray-700">Câu {idx + 1}</span>
                                    {answer.isCorrect ? (
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                    ) : (
                                        <XCircle className="w-5 h-5 text-red-600" />
                                    )}
                                </div>
                                <div className="mt-2 text-sm">
                                    <div className="flex gap-4">
                                        <span className={answer.isCorrect ? 'text-green-700' : 'text-red-700'}>
                                            Bạn chọn: <strong>{answer.selectedOption}</strong>
                                        </span>
                                        {!answer.isCorrect && (
                                            <span className="text-green-700">
                                                Đáp án đúng: <strong>{answer.correctOption}</strong>
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
