'use client';

import { useQuery } from '@tanstack/react-query';
import { getLeaderboard } from '@/lib/api-client';
import { Trophy, Medal, Crown } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

export default function LeaderboardPage() {
    const { data: leaders, isLoading } = useQuery({
        queryKey: ['leaderboard'],
        queryFn: () => getLeaderboard(50),
    });

    const getRankIcon = (index: number) => {
        switch (index) {
            case 0: return <Crown className="w-6 h-6 text-yellow-500 fill-yellow-500" />;
            case 1: return <Medal className="w-6 h-6 text-gray-400 fill-gray-400" />;
            case 2: return <Medal className="w-6 h-6 text-amber-700 fill-amber-700" />;
            default: return <span className="font-bold text-gray-500 w-6 text-center">{index + 1}</span>;
        }
    };

    return (
        <div className="container mx-auto max-w-2xl py-8 px-4">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-8 text-center text-white">
                    <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-300" />
                    <h1 className="text-3xl font-bold mb-2">Bảng Xếp Hạng</h1>
                    <p className="opacity-90">Vinh danh những nhà vô địch học tập</p>
                </div>

                <div className="p-4">
                    {isLoading ? (
                        <div className="space-y-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 border rounded-xl">
                                    <Skeleton className="w-8 h-8 rounded-full" />
                                    <Skeleton className="w-10 h-10 rounded-full" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-4 w-1/3" />
                                        <Skeleton className="h-3 w-1/4" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="divide-y">
                            {leaders?.map((user: { id: string; avatarUrl?: string; fullName?: string; level?: number; badges?: unknown[]; xp: number }, index: number) => (
                                <div
                                    key={user.id}
                                    className={`flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors ${index < 3 ? 'bg-gradient-to-r from-yellow-50/50' : ''}`}
                                >
                                    <div className="flex-shrink-0 w-8 flex justify-center">
                                        {getRankIcon(index)}
                                    </div>

                                    <Avatar className="w-10 h-10 border-2 border-white shadow-sm">
                                        <AvatarImage src={user.avatarUrl} />
                                        <AvatarFallback>{user.fullName?.[0] || 'U'}</AvatarFallback>
                                    </Avatar>

                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-gray-900 truncate">
                                            {user.fullName || 'Người dùng ẩn danh'}
                                        </p>
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium">
                                                Lv.{user.level}
                                            </span>
                                            {(user.badges?.length ?? 0) > 0 && (
                                                <span className="flex items-center gap-1">
                                                    <Medal className="w-3 h-3" />
                                                    {user.badges?.length} danh hiệu
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <div className="font-bold text-indigo-600">{user.xp.toLocaleString()} XP</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
