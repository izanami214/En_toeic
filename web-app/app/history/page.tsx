'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUserTestHistory } from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';
import { Calendar, Clock, Trophy, ArrowLeft, RefreshCw, Eye, Filter, BarChart2, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ScoreChart from '@/components/ScoreChart';
import ActivityChart from '@/components/ActivityChart';

type TestType = 'FULL' | 'MINI' | 'PART' | 'ALL';
type SortOption = 'date-desc' | 'date-asc' | 'score-desc' | 'score-asc';

export default function HistoryPage() {
    const router = useRouter();
    const { user } = useAuthStore();
    const userId = user?.id;
    const [filterType, setFilterType] = useState<TestType>('ALL');
    const [sortBy, setSortBy] = useState<SortOption>('date-desc');

    const { data: sessions, isLoading, error } = useQuery({
        queryKey: ['history', userId],
        queryFn: () => getUserTestHistory(userId || ''),
        enabled: !!userId,
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">Đang tải lịch sử...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-red-500">Không thể tải lịch sử làm bài</div>
            </div>
        );
    }

    // Filter and sort
    let filteredSessions = sessions || [];

    if (filterType !== 'ALL') {
        filteredSessions = filteredSessions.filter((s: any) => s.testType === filterType);
    }

    filteredSessions = [...filteredSessions].sort((a: any, b: any) => {
        switch (sortBy) {
            case 'date-desc':
                return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
            case 'date-asc':
                return new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
            case 'score-desc':
                return (b.score || 0) - (a.score || 0);
            case 'score-asc':
                return (a.score || 0) - (b.score || 0);
            default:
                return 0;
        }
    });

    // Prepare data for charts
    const chartData = (sessions || []).map((s: any) => ({
        date: new Date(s.submittedAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
        score: s.score || 0,
        title: s.testTitle,
        fullDate: s.submittedAt, // For activity chart
    }));

    const activityData = (sessions || []).map((s: any) => ({
        date: s.submittedAt
    }));

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <button
                    onClick={() => router.push('/tests')}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Về danh sách đề thi
                </button>

                <div className="flex items-center gap-3 mb-8">
                    <Trophy className="w-10 h-10 text-blue-600" />
                    <h1 className="text-4xl font-bold text-gray-800">Lịch Sử & Thống Kê</h1>
                </div>

                {/* Dashboard Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Score Trend Chart */}
                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <TrendingUp className="w-6 h-6 text-purple-600" />
                            <h2 className="text-xl font-bold text-gray-800">Biểu Đồ Điểm Số</h2>
                        </div>
                        <ScoreChart data={chartData} />
                    </div>

                    {/* Activity Chart */}
                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <BarChart2 className="w-6 h-6 text-green-600" />
                            <h2 className="text-xl font-bold text-gray-800">Tần Suất Luyện Tập</h2>
                        </div>
                        <ActivityChart data={activityData} />
                    </div>
                </div>

                {/* Session List Container */}
                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Lịch Sử Làm Bài Chi Tiết</h2>

                    {/* Filters */}
                    <div className="flex flex-col md:flex-row gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Filter className="w-4 h-4 inline mr-1" />
                                Loại đề
                            </label>
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value as TestType)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="ALL">Tất cả</option>
                                <option value="FULL">Full Test</option>
                                <option value="MINI">Mini Test</option>
                                <option value="PART">Part Test</option>
                            </select>
                        </div>

                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Sắp xếp
                            </label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as SortOption)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="date-desc">Mới nhất</option>
                                <option value="date-asc">Cũ nhất</option>
                                <option value="score-desc">Điểm cao nhất</option>
                                <option value="score-asc">Điểm thấp nhất</option>
                            </select>
                        </div>
                    </div>

                    {/* Session List */}
                    {filteredSessions.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="text-gray-400 mb-4">
                                <Trophy className="w-20 h-20 mx-auto mb-4" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                Chưa có lịch sử làm bài
                            </h3>
                            <p className="text-gray-500 mb-6">
                                Hãy bắt đầu làm bài thi đầu tiên của bạn!
                            </p>
                            <Link
                                href="/tests"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all hover:scale-105 shadow-md"
                            >
                                Xem danh sách đề thi
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredSessions.map((session: any) => {
                                const scoreClass = (session.score || 0) >= 400 ? 'text-green-600' : 'text-blue-600';
                                const isHighScore = (session.score || 0) >= 450;
                                const date = new Date(session.submittedAt);
                                const isRecent = (Date.now() - date.getTime()) < 24 * 60 * 60 * 1000;

                                return (
                                    <div
                                        key={session.sessionId}
                                        className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-lg transition-all"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <h3 className="text-xl font-bold text-gray-800">
                                                        {session.testTitle}
                                                    </h3>
                                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                                                        {session.testType}
                                                    </span>
                                                    {isHighScore && (
                                                        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                                                            🏆 High Score
                                                        </span>
                                                    )}
                                                    {isRecent && (
                                                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                                            ⭐ Mới
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                                    <div className="flex items-center gap-2">
                                                        <Trophy className={`w-4 h-4 ${scoreClass}`} />
                                                        <span className={`font-semibold ${scoreClass}`}>
                                                            {session.score || 0} điểm
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-4 h-4" />
                                                        <span>{Math.floor(session.durationTaken / 60)} phút</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4" />
                                                        <span>{date.toLocaleDateString('vi-VN')} - {date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex gap-3">
                                                <Link
                                                    href={`/tests/${session.testId}/result/${session.sessionId}`}
                                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all hover:scale-105 shadow-md"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    Xem kết quả
                                                </Link>
                                                <Link
                                                    href={`/tests/${session.testId}`}
                                                    className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-all hover:scale-105 shadow-md"
                                                >
                                                    <RefreshCw className="w-4 h-4" />
                                                    Làm lại
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Stats Footer */}
                    {filteredSessions.length > 0 && (
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                                <div className="bg-blue-50 rounded-lg p-4">
                                    <div className="text-2xl font-bold text-blue-600">{filteredSessions.length}</div>
                                    <div className="text-sm text-gray-600">Tổng bài thi</div>
                                </div>
                                <div className="bg-green-50 rounded-lg p-4">
                                    <div className="text-2xl font-bold text-green-600">
                                        {Math.round(filteredSessions.reduce((acc: number, s: any) => acc + (s.score || 0), 0) / filteredSessions.length)}
                                    </div>
                                    <div className="text-sm text-gray-600">Điểm trung bình</div>
                                </div>
                                <div className="bg-yellow-50 rounded-lg p-4">
                                    <div className="text-2xl font-bold text-yellow-600">
                                        {Math.max(...filteredSessions.map((s: any) => s.score || 0))}
                                    </div>
                                    <div className="text-sm text-gray-600">Điểm cao nhất</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
