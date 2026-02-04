'use client';

import { useQuery } from '@tanstack/react-query';
import { getTests } from '@/lib/api';
import { FileText, HelpCircle, Layers } from 'lucide-react';

export default function AdminDashboard() {
    const { data: tests, isLoading } = useQuery({
        queryKey: ['tests'],
        queryFn: getTests,
    });

    const totalTests = tests?.length || 0;
    const totalParts = tests?.reduce((sum: number, test: any) => sum + (test.parts?.length || 0), 0) || 0;
    const totalQuestions = tests?.reduce(
        (sum: number, test: any) =>
            sum +
            (test.parts?.reduce(
                (partSum: number, part: any) => partSum + (part.questions?.length || 0),
                0
            ) || 0),
        0
    ) || 0;

    const stats = [
        {
            label: 'Total Tests',
            value: totalTests,
            icon: FileText,
            color: 'from-blue-500 to-indigo-600',
        },
        {
            label: 'Total Parts',
            value: totalParts,
            icon: Layers,
            color: 'from-purple-500 to-pink-600',
        },
        {
            label: 'Total Questions',
            value: totalQuestions,
            icon: HelpCircle,
            color: 'from-green-500 to-teal-600',
        },
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
                <p className="text-blue-200">Overview of your TOEIC Master AI content</p>
            </div>

            {isLoading ? (
                <div className="text-white">Loading stats...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all"
                        >
                            <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${stat.color} mb-4`}>
                                <stat.icon className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-2">{stat.value}</h3>
                            <p className="text-blue-200">{stat.label}</p>
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-8 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h2 className="text-2xl font-bold text-white mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <a
                        href="/admin/tests/new"
                        className="flex items-center gap-3 p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                    >
                        <FileText className="w-5 h-5" />
                        <span className="font-semibold">Create New Test</span>
                    </a>
                    <a
                        href="/admin/tests"
                        className="flex items-center gap-3 p-4 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
                    >
                        <Layers className="w-5 h-5" />
                        <span className="font-semibold">Manage Tests</span>
                    </a>
                </div>
            </div>
        </div>
    );
}
