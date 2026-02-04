'use client';

import { useQuery } from '@tanstack/react-query';
import { getTestById } from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, CheckCircle, XCircle } from 'lucide-react';

export default function TestDetailPage() {
    const params = useParams();
    const router = useRouter();
    const testId = params.id as string;

    const { data: test, isLoading, error } = useQuery({
        queryKey: ['test', testId],
        queryFn: () => getTestById(testId),
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">Đang tải...</div>
            </div>
        );
    }

    if (error || !test) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-red-500">Không tìm thấy đề thi</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Quay lại
                </button>

                <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-8">
                        <h1 className="text-3xl font-bold text-white mb-4">{test.title}</h1>
                        <div className="flex items-center gap-4 text-white/90 mb-4">
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5" />
                                <span>{Math.floor(test.duration / 60)} phút</span>
                            </div>
                            <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                                {test.type}
                            </span>
                        </div>
                        <Link
                            href={`/tests/${test.id}/take`}
                            className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all hover:scale-105 shadow-lg"
                        >
                            Làm bài thi
                        </Link>
                    </div>

                    <div className="p-8">
                        {test.parts?.map((part: any, partIndex: number) => (
                            <div key={part.id} className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                    Part {part.partNumber}
                                </h2>

                                <div className="space-y-6">
                                    {part.questions?.map((question: any, qIndex: number) => (
                                        <div
                                            key={question.id}
                                            className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex items-start gap-4">
                                                <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-semibold">
                                                    {qIndex + 1}
                                                </span>
                                                <div className="flex-1">
                                                    <p className="text-gray-800 mb-4 leading-relaxed">
                                                        {question.content}
                                                    </p>

                                                    <div className="grid grid-cols-1 gap-3">
                                                        {Object.entries(question.options).map(([key, value]) => (
                                                            <div
                                                                key={key}
                                                                className={`p-3 rounded-lg border-2 transition-all ${key === question.correctOpt
                                                                    ? 'border-green-500 bg-green-50'
                                                                    : 'border-gray-200 bg-gray-50'
                                                                    }`}
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    {key === question.correctOpt ? (
                                                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                                                    ) : (
                                                                        <XCircle className="w-5 h-5 text-gray-400" />
                                                                    )}
                                                                    <span className="font-semibold text-gray-700">
                                                                        {key}.
                                                                    </span>
                                                                    <span className="text-gray-800">{value as string}</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {question.explanation && (
                                                        <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                                                            <p className="text-sm text-gray-700">
                                                                <strong>Giải thích:</strong> {question.explanation}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
