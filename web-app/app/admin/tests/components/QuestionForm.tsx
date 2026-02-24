'use client';

import { Trash2 } from 'lucide-react';

interface QuestionFormProps {
    question: {
        content?: string;
        options: { A: string; B: string; C: string; D: string };
        correctOpt: string;
        explanation?: string;
        imageUrl?: string;
        audioUrl?: string;
        transcript?: string;
    };
    onChange: (question: QuestionFormProps['question']) => void;
    onRemove: () => void;
    index: number;
}

export default function QuestionForm({ question, onChange, onRemove, index }: QuestionFormProps) {
    const handleChange = (field: string, value: string) => {
        onChange({ ...question, [field]: value });
    };

    const handleOptionChange = (option: 'A' | 'B' | 'C' | 'D', value: string) => {
        onChange({
            ...question,
            options: { ...question.options, [option]: value },
        });
    };

    return (
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-white">Question {index + 1}</h4>
                <button
                    type="button"
                    onClick={onRemove}
                    className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            <div className="space-y-4">
                {/* Content */}
                <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">
                        Question Content (Optional)
                    </label>
                    <textarea
                        value={question.content || ''}
                        onChange={(e) => handleChange('content', e.target.value)}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        placeholder="Enter question text..."
                    />
                </div>

                {/* Image URL */}
                <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">
                        Image URL (Optional)
                    </label>
                    <input
                        type="text"
                        value={question.imageUrl || ''}
                        onChange={(e) => handleChange('imageUrl', e.target.value)}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://example.com/image.jpg"
                    />
                </div>

                {/* Audio URL */}
                <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">
                        Audio URL (Optional)
                    </label>
                    <input
                        type="text"
                        value={question.audioUrl || ''}
                        onChange={(e) => handleChange('audioUrl', e.target.value)}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://example.com/audio.mp3"
                    />
                </div>

                {/* Transcript */}
                <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">
                        Transcript (Optional)
                    </label>
                    <textarea
                        value={question.transcript || ''}
                        onChange={(e) => handleChange('transcript', e.target.value)}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={2}
                        placeholder="Audio transcript..."
                    />
                </div>

                {/* Options */}
                <div className="grid grid-cols-2 gap-4">
                    {(['A', 'B', 'C', 'D'] as const).map((option) => (
                        <div key={option}>
                            <label className="block text-sm font-medium text-blue-200 mb-2">
                                Option {option} *
                            </label>
                            <input
                                type="text"
                                value={question.options[option]}
                                onChange={(e) => handleOptionChange(option, e.target.value)}
                                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder={`Option ${option}`}
                                required
                            />
                        </div>
                    ))}
                </div>

                {/* Correct Option */}
                <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">
                        Correct Option *
                    </label>
                    <select
                        value={question.correctOpt}
                        onChange={(e) => handleChange('correctOpt', e.target.value)}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="">Select correct option</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                    </select>
                </div>

                {/* Explanation */}
                <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">
                        Explanation (Optional)
                    </label>
                    <textarea
                        value={question.explanation || ''}
                        onChange={(e) => handleChange('explanation', e.target.value)}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        placeholder="Explain the correct answer..."
                    />
                </div>
            </div>
        </div>
    );
}
