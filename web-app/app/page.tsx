import HeroSection from '@/components/home/HeroSection';
import StatsOverview from '@/components/home/StatsOverview';
import FeatureGrid from '@/components/home/FeatureGrid';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            TOEIC Master AI
          </h1>
          <p className="text-gray-600">
            Nền tảng luyện thi TOEIC thông minh
          </p>
        </div>

        {/* Hero Section */}
        <div className="mb-8">
          <HeroSection />
        </div>

        {/* Stats Overview */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="w-1 h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></span>
            Thống kê của bạn
          </h2>
          <StatsOverview />
        </div>

        {/* Feature Grid */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="w-1 h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></span>
            Tính năng nổi bật
          </h2>
          <FeatureGrid />
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-200">
          <div className="text-center text-gray-500 text-sm">
            <p>© 2026 TOEIC Master AI. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
