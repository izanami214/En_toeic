'use client';

import { Volume2, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { getWordOfTheDay } from '@/data/vocabulary';

export default function DailyWord() {
    const word = getWordOfTheDay();
    const [isLearned, setIsLearned] = useState(false);

    const handleSpeak = () => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(word.term);
            utterance.lang = 'en-US';
            utterance.rate = 0.8;
            window.speechSynthesis.speak(utterance);
        }
    };

    return (
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <span className="text-3xl">📚</span>
                    <h3 className="font-bold text-gray-800 text-lg">Từ của hôm nay</h3>
                </div>
                <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full font-semibold">
                    {word.partOfSpeech}
                </span>
            </div>

            {/* Word */}
            <div className="mb-3">
                <h2 className="text-3xl font-bold text-blue-600 mb-1">{word.term}</h2>
                <p className="text-sm text-gray-500 italic">{word.pronunciation}</p>
            </div>

            {/* Meaning */}
            <div className="mb-3 p-3 bg-white rounded-xl">
                <p className="text-gray-700 font-medium">{word.meaning}</p>
            </div>

            {/* Example */}
            <div className="mb-4 p-3 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-sm text-gray-600 italic">"{word.example}"</p>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
                <button
                    onClick={handleSpeak}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                    <Volume2 className="w-4 h-4" />
                    Nghe phát âm
                </button>
                <button
                    onClick={() => setIsLearned(!isLearned)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${isLearned
                            ? 'bg-green-500 text-white'
                            : 'bg-white border-2 border-green-500 text-green-600 hover:bg-green-50'
                        }`}
                >
                    <CheckCircle className="w-4 h-4" />
                    {isLearned ? 'Đã thuộc!' : 'Đánh dấu'}
                </button>
            </div>

            {isLearned && (
                <div className="mt-3 p-2 bg-green-100 rounded-lg text-center animate-slideIn">
                    <p className="text-sm text-green-700 font-medium">🎉 Tuyệt vời! Hãy ôn lại từ này thường xuyên nhé!</p>
                </div>
            )}
        </div>
    );
}
