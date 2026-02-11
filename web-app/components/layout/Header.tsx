'use client';

import Link from 'next/link';
import { useAuthStore } from '@/lib/auth-store';
import { useRouter } from 'next/navigation';

export default function Header() {
    const router = useRouter();
    const { user, isAuthenticated, logout } = useAuthStore();

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    return (
        <header className="bg-white shadow-sm">
            <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
                <div className="flex w-full items-center justify-between border-b border-gray-200 py-6 lg:border-none">
                    <div className="flex items-center">
                        <Link href="/" className="text-2xl font-bold text-indigo-600">
                            TOEIC Master AI
                        </Link>
                        <div className="ml-10 hidden space-x-8 lg:block">
                            <Link href="/tests" className="text-base font-medium text-gray-500 hover:text-gray-900">
                                Luyện Thi
                            </Link>
                            <Link href="/flashcards" className="text-base font-medium text-gray-500 hover:text-gray-900">
                                Học Từ Vựng
                            </Link>
                        </div>
                    </div>
                    <div className="ml-10 space-x-4">
                        {isAuthenticated && user ? (
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium text-gray-700">
                                    Xin chào, {user.fullName || user.email}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300"
                                >
                                    Đăng xuất
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link
                                    href="/login"
                                    className="inline-block rounded-md bg-indigo-600 px-4 py-2 text-base font-medium text-white hover:bg-indigo-700"
                                >
                                    Đăng nhập
                                </Link>
                                <Link
                                    href="/register"
                                    className="inline-block rounded-md bg-white px-4 py-2 text-base font-medium text-indigo-600 border border-indigo-600 hover:bg-indigo-50"
                                >
                                    Đăng ký
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
}
