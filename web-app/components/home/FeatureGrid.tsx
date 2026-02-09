import Link from 'next/link';
import { BookOpen, Target, BarChart3, Settings } from 'lucide-react';

export default function FeatureGrid() {
    const features = [
        {
            icon: BookOpen,
            title: 'Luyện Thi Mô Phỏng',
            description: 'Full Test & Mini Test với timer chính xác như thi thật',
            href: '/tests',
            gradient: 'from-blue-500 to-indigo-600',
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
        },
        {
            icon: Target,
            title: 'Flashcard Thông Minh',
            description: 'Học 600+ từ vựng TOEIC với phương pháp SRS',
            href: '/flashcards',
            gradient: 'from-purple-500 to-pink-600',
            iconBg: 'bg-purple-100',
            iconColor: 'text-purple-600',
        },
        {
            icon: BarChart3,
            title: 'Phân Tích Chi Tiết',
            description: 'Theo dõi tiến độ & xác định điểm yếu cần cải thiện',
            href: '/history',
            gradient: 'from-green-500 to-emerald-600',
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600',
        },
        {
            icon: Settings,
            title: 'Quản Lý Nội Dung',
            description: 'Tạo và quản lý đề thi, từ vựng (Admin)',
            href: '/admin',
            gradient: 'from-orange-500 to-red-600',
            iconBg: 'bg-orange-100',
            iconColor: 'text-orange-600',
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                    <Link
                        key={index}
                        href={feature.href}
                        className="group relative overflow-hidden bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all hover:scale-[1.02] border border-gray-100"
                    >
                        {/* Gradient background on hover */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity`}></div>

                        <div className="relative z-10">
                            <div className={`${feature.iconBg} w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                <Icon className={`w-7 h-7 ${feature.iconColor}`} />
                            </div>

                            <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-gray-900">
                                {feature.title}
                            </h3>

                            <p className="text-gray-600 leading-relaxed">
                                {feature.description}
                            </p>

                            <div className="mt-4 flex items-center gap-2 text-blue-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                                Khám phá ngay
                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}
