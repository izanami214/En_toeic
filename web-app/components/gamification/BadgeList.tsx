import React from 'react';
import { Badge as BadgeType } from '@/types/gamification';
import { Award } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface BadgeListProps {
    badges: { badge: BadgeType, earnedAt: string }[];
}

export function BadgeList({ badges }: BadgeListProps) {
    if (!badges || badges.length === 0) {
        return (
            <div className="text-center p-4 border rounded-lg bg-gray-50 text-gray-500">
                <Award className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Chưa có huy hiệu nào.</p>
                <p className="text-xs">Hãy hoàn thành bài thi đầu tiên!</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-3 gap-2">
            {badges.map((userBadge, index) => (
                <TooltipProvider key={index}>
                    <Tooltip>
                        <TooltipTrigger>
                            <div className="flex flex-col items-center p-2 rounded-lg bg-yellow-50 border border-yellow-200 cursor-help transition-all hover:bg-yellow-100">
                                <div className="p-2 bg-yellow-100 rounded-full mb-1">
                                    <Award className="w-6 h-6 text-yellow-600" />
                                </div>
                                <span className="text-xs font-medium text-center line-clamp-1">{userBadge.badge.name}</span>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <div className="text-center">
                                <p className="font-bold">{userBadge.badge.name}</p>
                                <p className="text-xs mb-1">{userBadge.badge.description}</p>
                                <p className="text-[10px] text-gray-400">Đạt được: {new Date(userBadge.earnedAt).toLocaleDateString('vi-VN')}</p>
                            </div>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            ))}
            {/* Placeholders for unearned badges logic could go here */}
        </div>
    );
}
