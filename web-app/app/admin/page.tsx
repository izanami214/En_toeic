'use client';

import { useQuery } from '@tanstack/react-query';
import { getTests } from '@/lib/api';
import { FileText, HelpCircle, Layers, Plus } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
    const { data: tests, isLoading } = useQuery({
        queryKey: ['tests'],
        queryFn: getTests,
    });

    const safeTests = Array.isArray(tests) ? tests : [];

    const totalTests = safeTests.length;
    const totalParts = safeTests.reduce(
        (sum: number, test: { parts?: unknown[] }) => sum + (Array.isArray(test.parts) ? test.parts.length : 0),
        0
    );
    const totalQuestions = safeTests.reduce(
        (sum: number, test: { parts?: { questions?: unknown[] }[] }) =>
            sum + (Array.isArray(test.parts) ? test.parts.reduce(
                (partSum: number, part: { questions?: unknown[] }) =>
                    partSum + (Array.isArray(part.questions) ? part.questions.length : 0),
                0
            ) : 0),
        0
    );

    const stats = [
        {
            label: 'Total Tests',
            value: totalTests,
            icon: FileText,
            color: 'from-blue-500 to-indigo-600',
            bg: 'bg-blue-500/10 border-blue-500/20',
        },
        {
            label: 'Total Parts',
            value: totalParts,
            icon: Layers,
            color: 'from-purple-500 to-pink-600',
            bg: 'bg-purple-500/10 border-purple-500/20',
        },
        {
            label: 'Total Questions',
            value: totalQuestions,
            icon: HelpCircle,
            color: 'from-green-500 to-teal-600',
            bg: 'bg-green-500/10 border-green-500/20',
        },
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
                <p className="text-blue-200">Overview of your TOEIC Master AI content</p>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white/10 rounded-2xl p-6 border border-white/20 animate-pulse">
                            <div className="h-12 w-12 bg-white/20 rounded-xl mb-4" />
                            <div className="h-8 w-16 bg-white/20 rounded mb-2" />
                            <div className="h-4 w-24 bg-white/10 rounded" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className={`${stat.bg} backdrop-blur-lg rounded-2xl p-6 border hover:scale-105 transition-all`}
                        >
                            <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${stat.color} mb-4`}>
                                <stat.icon className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                            <p className="text-blue-200 text-sm">{stat.label}</p>
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-8 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h2 className="text-2xl font-bold text-white mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link
                        href="/admin/tests/new"
                        className="flex items-center gap-3 p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all hover:scale-105 font-semibold"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Tạo Bài Thi Mới</span>
                    </Link>
                    <Link
                        href="/admin/tests"
                        className="flex items-center gap-3 p-4 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-all hover:scale-105 font-semibold"
                    >
                        <Layers className="w-5 h-5" />
                        <span>Quản Lý Bài Thi</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
