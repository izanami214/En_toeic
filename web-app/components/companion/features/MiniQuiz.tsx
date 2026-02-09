'use client';

import { useState } from 'react';
import { RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { getRandomQuestion } from '@/data/mini-quiz';

export default function MiniQuiz() {
    const [question, setQuestion] = useState(getRandomQuestion());
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);

    const handleAnswerSelect = (index: number) => {
        if (showResult) return; // Prevent changing answer after submission
        setSelectedAnswer(index);
    };

    const handleSubmit = () => {
        if (selectedAnswer !== null) {
            setShowResult(true);
        }
    };

    const handleNext = () => {
        setQuestion(getRandomQuestion());
        setSelectedAnswer(null);
        setShowResult(false);
    };

    const isCorrect = selectedAnswer === question.correctAnswer;

    return (
        <div className="bg-purple-50 border-2 border-purple-300 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <span className="text-3xl">⚡</span>
                    <h3 className="font-bold text-gray-800 text-lg">Mini Quiz</h3>
                </div>
                <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded-full font-semibold">
                    {question.category === 'grammar' ? 'Ngữ pháp' : 'Từ vựng'}
                </span>
            </div>

            {/* Question */}
            <div className="mb-4 p-4 bg-white rounded-xl shadow-sm">
                <p className="text-gray-800 font-medium">{question.question}</p>
            </div>

            {/* Options */}
            <div className="space-y-2 mb-4">
                {question.options.map((option, index) => {
                    const isSelected = selectedAnswer === index;
                    const isCorrectOption = index === question.correctAnswer;

                    let bgColor = 'bg-white hover:bg-purple-50';
                    let borderColor = 'border-gray-200';
                    let textColor = 'text-gray-700';

                    if (showResult) {
                        if (isCorrectOption) {
                            bgColor = 'bg-green-100';
                            borderColor = 'border-green-500';
                            textColor = 'text-green-800';
                        } else if (isSelected && !isCorrect) {
                            bgColor = 'bg-red-100';
                            borderColor = 'border-red-500';
                            textColor = 'text-red-800';
                        }
                    } else if (isSelected) {
                        bgColor = 'bg-purple-100';
                        borderColor = 'border-purple-500';
                        textColor = 'text-purple-800';
                    }

                    return (
                        <button
                            key={index}
                            onClick={() => handleAnswerSelect(index)}
                            disabled={showResult}
                            className={`w-full p-3 rounded-xl border-2 transition-all text-left ${bgColor} ${borderColor} ${textColor} ${!showResult ? 'hover:scale-[1.02] cursor-pointer' : 'cursor-default'
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <span className="font-medium">
                                    {String.fromCharCode(65 + index)}. {option}
                                </span>
                                {showResult && isCorrectOption && (
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                )}
                                {showResult && isSelected && !isCorrect && (
                                    <XCircle className="w-5 h-5 text-red-600" />
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Result & Explanation */}
            {showResult && (
                <div className={`mb-4 p-4 rounded-xl animate-slideIn ${isCorrect ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'
                    }`}>
                    <div className="flex items-center gap-2 mb-2">
                        {isCorrect ? (
                            <>
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                <span className="font-bold text-green-800">Chính xác! 🎉</span>
                            </>
                        ) : (
                            <>
                                <XCircle className="w-5 h-5 text-red-600" />
                                <span className="font-bold text-red-800">Chưa đúng!</span>
                            </>
                        )}
                    </div>
                    <p className="text-sm text-gray-700">{question.explanation}</p>
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
                {!showResult ? (
                    <button
                        onClick={handleSubmit}
                        disabled={selectedAnswer === null}
                        className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${selectedAnswer !== null
                                ? 'bg-purple-500 hover:bg-purple-600 text-white cursor-pointer'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        Kiểm tra
                    </button>
                ) : (
                    <button
                        onClick={handleNext}
                        className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Câu tiếp theo
                    </button>
                )}
            </div>
        </div>
    );
}
