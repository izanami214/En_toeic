'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, BookOpen, Home } from 'lucide-react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const navItems = [
        { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
        { href: '/admin/tests', icon: FileText, label: 'Tests' },
        { href: '/admin/flashcards', icon: BookOpen, label: 'Flashcards' },
    ];

    const isActive = (href: string) => {
        if (href === '/admin') {
            return pathname === href;
        }
        return pathname.startsWith(href);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Navigation Sidebar */}
            <aside className="fixed left-0 top-0 h-full w-64 bg-white/10 backdrop-blur-xl border-r border-white/20 z-10">
                <div className="p-6">
                    <Link href="/" className="flex items-center gap-2 text-white hover:text-blue-200 transition-colors mb-8">
                        <Home className="w-5 h-5" />
                        <span className="text-sm">← Back to App</span>
                    </Link>

                    <h1 className="text-2xl font-bold text-white mb-2">Admin Panel</h1>
                    <p className="text-sm text-blue-200">TOEIC Master AI</p>
                </div>

                <nav className="px-4 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive(item.href)
                                    ? 'bg-white/20 text-white shadow-lg'
                                    : 'text-blue-100 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/20">
                    <p className="text-xs text-blue-200 text-center">
                        © 2026 TOEIC Master AI
                    </p>
                </div>
            </aside>

            {/* Main Content */}
            <main className="ml-64 p-8">
                {children}
            </main>
        </div>
    );
}
