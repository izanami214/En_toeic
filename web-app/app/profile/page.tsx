'use client';

import { useAuthStore } from '@/lib/auth-store';
import { LevelProgress } from '@/components/gamification/LevelProgress';
import { BadgeList } from '@/components/gamification/BadgeList';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// import { UserBadge } from '@/types/gamification'; // Assuming UserBadge is defined in types

export default function ProfilePage() {
    const { user } = useAuthStore();

    if (!user) {
        return <div className="p-8 text-center">Vui lòng đăng nhập để xem hồ sơ.</div>;
    }

    // Badges are now populated from backend via useAuthStore
    const badges = user.badges || [];

    return (
        <div className="container mx-auto max-w-4xl py-8 px-4 space-y-6">
            {/* Header / Info Card */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <Avatar className="w-24 h-24 border-4 border-primary/10">
                            {/* Avatar chung cho tất cả các user */}
                            <AvatarImage src={'https://api.dicebear.com/9.x/notionists/svg?seed=' + user.email} />
                            <AvatarFallback className="text-2xl">{user.fullName?.[0] || 'U'}</AvatarFallback>
                        </Avatar>

                        <div className="flex-1 text-center md:text-left space-y-2">
                            <h1 className="text-2xl font-bold">{user.fullName}</h1>
                            <p className="text-muted-foreground">{user.email}</p>
                            <div className="flex items-center justify-center md:justify-start gap-4 text-sm">
                                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                                    Role: {user.role}
                                </span>
                                <span className="text-muted-foreground">
                                    Tham gia: {new Date().toLocaleDateString('vi-VN')}
                                </span>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <div className="text-2xl font-bold text-primary">{user.streak || 0} 🔥</div>
                                <div className="text-xs text-muted-foreground">Streak Ngày</div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <div className="text-2xl font-bold text-primary">{user.level || 1} 👑</div>
                                <div className="text-xs text-muted-foreground">Cấp độ</div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Level Progress */}
                <Card>
                    <CardHeader>
                        <CardTitle>Tiến độ Cấp độ</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <LevelProgress xp={user.xp || 0} level={user.level || 1} />

                        <div className="mt-6 space-y-4">
                            <h3 className="font-semibold text-sm">Thống kê học tập</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between py-2 border-b">
                                    <span className="text-muted-foreground">Tổng XP tích lũy</span>
                                    <span className="font-medium">{user.xp || 0} XP</span>
                                </div>
                                <div className="flex justify-between py-2 border-b">
                                    <span className="text-muted-foreground">Cấp độ hiện tại</span>
                                    <span className="font-medium">Level {user.level || 1}</span>
                                </div>
                                {/* Add more stats here */}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Badges */}
                <Card>
                    <CardHeader>
                        <CardTitle>Bộ sưu tập Huy hiệu</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <BadgeList badges={badges} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
