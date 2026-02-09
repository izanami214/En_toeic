'use client';

import { useQuery } from '@tanstack/react-query';
import { getUserTestHistory } from '@/lib/api';
import { DEMO_USER_ID } from '@/lib/constants';
import { Trophy, Target, BookOpen, TrendingUp } from 'lucide-react';

export default function StatsOverview() {
    const { data: sessions, isLoading } = useQuery({
        queryKey: ['history', DEMO_USER_ID],
        queryFn: () => getUserTestHistory(DEMO_USER_ID),
    });

    const testsTaken = sessions?.length || 0;
    const avgScore = sessions?.length
        ? Math.round(sessions.reduce((acc: number, s: any) => acc + (s.score || 0), 0) / sessions.length)
        : 0;
    const highScore = sessions?.length
        ? Math.max(...sessions.map((s: any) => s.score || 0))
        : 0;

    const stats = [
        {
            icon: Trophy,
            label: 'Bài thi đã làm',
            value: testsTaken,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            iconBg: 'bg-blue-100',
        },
        {
            icon: Target,
            label: 'Điểm trung bình',
            value: avgScore,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            iconBg: 'bg-green-100',
        },
        {
            icon: TrendingUp,
            label: 'Điểm cao nhất',
            value: highScore,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
            iconBg: 'bg-purple-100',
        },
    ];

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-2xl p-6 shadow-lg animate-pulse">
                        <div className="h-12 bg-gray-200 rounded-lg mb-4"></div>
                        <div className="h-8 bg-gray-200 rounded w-24"></div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <div
                        key={index}
                        className={`${stat.bgColor} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105 border border-gray-100`}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`${stat.iconBg} p-3 rounded-xl`}>
                                <Icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                        </div>
                        <div className={`text-4xl font-bold ${stat.color} mb-2`}>
                            {stat.value}
                        </div>
                        <div className="text-sm text-gray-600 font-medium">
                            {stat.label}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
