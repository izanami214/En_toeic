'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function HeroSection() {
    const [greeting, setGreeting] = useState('');
    const [quote, setQuote] = useState('');

    useEffect(() => {
        const hour = new Date().getHours();
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setGreeting(hour < 12 ? 'Chào buổi sáng' : hour < 18 ? 'Chào buổi chiều' : 'Chào buổi tối');

        const quotes = [
            'Mỗi ngày luyện tập là một bước tiến gần hơn đến mục tiêu!',
            'Thành công là tổng của những nỗ lực nhỏ hàng ngày.',
            'Hôm nay bạn muốn chinh phục TOEIC 990 chứ?',
            'Kiên trì luyện tập - Tự tin chinh phục!',
        ];
        setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }, []);

    // Initial render to match server
    if (!greeting) return null; // Or a skeleton/loading state

    return (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-12 md:p-16 shadow-2xl">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-6 h-6 text-yellow-300" />
                    <span className="text-blue-100 font-medium">{greeting}!</span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                    Ready to Master TOEIC?
                </h1>

                <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-2xl">
                    {quote}
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                        href="/tests"
                        className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-50 transition-all hover:scale-105 shadow-xl group"
                    >
                        Bắt đầu luyện thi
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <Link
                        href="/history"
                        className="inline-flex items-center justify-center gap-2 bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/30 transition-all border border-white/30"
                    >
                        Xem tiến độ
                    </Link>
                </div>
            </div>
        </div>
    );
}
