'use client';

import { useQuery } from '@tanstack/react-query';
import { getTests } from '@/lib/api';
import Link from 'next/link';
import { BookOpen, Clock } from 'lucide-react';

export default function TestsPage() {
    const { data: tests, isLoading, error } = useQuery({
        queryKey: ['tests'],
        queryFn: getTests,
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">Đang tải...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-red-500">Lỗi: {(error as Error).message}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-800 mb-8">
                    Danh sách Đề thi TOEIC
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tests?.map((test: any) => (
                        <Link
                            key={test.id}
                            href={`/tests/${test.id}`}
                            className="block bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                        >
                            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
                                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                    <BookOpen className="w-6 h-6" />
                                    {test.title}
                                </h2>
                            </div>

                            <div className="p-6">
                                <div className="flex items-center gap-2 text-gray-600 mb-4">
                                    <Clock className="w-5 h-5" />
                                    <span>{Math.floor(test.duration / 60)} phút</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500">
                                        {test.parts?.length || 0} phần thi
                                    </span>
                                    <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                                        {test.type}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
