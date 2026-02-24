'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import {
    LayoutDashboard,
    FileText,
    BookOpen,
    LogOut,
    Home,
    ChevronRight,
    Shield,
} from 'lucide-react';

const navItems = [
    {
        label: 'Dashboard',
        href: '/admin',
        icon: LayoutDashboard,
        exact: true,
    },
    {
        label: 'Quản lý Bài thi',
        href: '/admin/tests',
        icon: FileText,
    },
    {
        label: 'Quản lý Flashcard',
        href: '/admin/flashcards',
        icon: BookOpen,
    },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuthStore();

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    const isActive = (href: string, exact?: boolean) => {
        if (exact) return pathname === href;
        return pathname.startsWith(href);
    };

    return (
        <aside className="w-64 min-h-screen bg-slate-900/80 backdrop-blur-xl border-r border-white/10 flex flex-col flex-shrink-0">
            {/* Logo / Brand */}
            <div className="px-6 py-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <div className="text-white font-bold text-sm leading-tight">TOEIC Master</div>
                        <div className="text-blue-400 text-xs">Admin Panel</div>
                    </div>
                </div>
            </div>

            {/* User Info */}
            <div className="px-6 py-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {user?.fullName?.charAt(0) || user?.email?.charAt(0) || 'A'}
                    </div>
                    <div className="min-w-0">
                        <div className="text-white text-sm font-medium truncate">{user?.fullName || 'Admin'}</div>
                        <div className="text-blue-400 text-xs truncate">{user?.email}</div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                {navItems.map((item) => {
                    const active = isActive(item.href, item.exact);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${active
                                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                : 'text-blue-200/70 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <item.icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-blue-400' : 'text-blue-400/60 group-hover:text-blue-300'}`} />
                            <span className="flex-1">{item.label}</span>
                            {active && <ChevronRight className="w-4 h-4 text-blue-400" />}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer Actions */}
            <div className="px-3 py-4 border-t border-white/10 space-y-1">
                <Link
                    href="/"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-blue-200/70 hover:bg-white/5 hover:text-white transition-all group"
                >
                    <Home className="w-5 h-5 text-blue-400/60 group-hover:text-blue-300" />
                    <span>Về Trang Chủ</span>
                </Link>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400/80 hover:bg-red-500/10 hover:text-red-300 transition-all group"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Đăng Xuất</span>
                </button>
            </div>
        </aside>
    );
}
