import Link from 'next/link';
import { BookOpen, Target, TrendingUp } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-white mb-6">
            TOEIC Master AI
          </h1>
          <p className="text-2xl text-blue-100 mb-8">
            Nền tảng luyện thi TOEIC thông minh với AI
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/tests"
              className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-50 transition-all hover:scale-105 shadow-xl"
            >
              <BookOpen className="w-6 h-6" />
              Bắt đầu luyện thi
            </Link>
            <Link
              href="/flashcards"
              className="inline-flex items-center gap-2 bg-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-purple-700 transition-all hover:scale-105 shadow-xl"
            >
              <Target className="w-6 h-6" />
              Ôn từ vựng
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-20">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-white">
            <Target className="w-12 h-12 mb-4" />
            <h3 className="text-xl font-bold mb-3">Đề thi sát thực tế</h3>
            <p className="text-blue-100">
              Bộ đề thi chuẩn ETS, mô phỏng 100% kỳ thi thật
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-white">
            <TrendingUp className="w-12 h-12 mb-4" />
            <h3 className="text-xl font-bold mb-3">Phân tích chi tiết</h3>
            <p className="text-blue-100">
              Thống kê lỗ hổng kiến thức, gợi ý lộ trình học cá nhân
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-white">
            <BookOpen className="w-12 h-12 mb-4" />
            <h3 className="text-xl font-bold mb-3">Flashcard thông minh</h3>
            <p className="text-blue-100">
              Hệ thống SRS giúp ghi nhớ từ vựng hiệu quả
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
