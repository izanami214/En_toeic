'use client';

import { useState } from 'react';
import { Plus, Trash2, Save, Layers } from 'lucide-react';
import QuestionForm from './QuestionForm';
import { TestType } from '@/lib/types';

interface Part {
    partNumber: number;
    questions: Array<{
        content?: string;
        options: { A: string; B: string; C: string; D: string };
        correctOpt: string;
        explanation?: string;
        imageUrl?: string;
        audioUrl?: string;
        transcript?: string;
    }>;
}

interface TestFormProps {
    initialData?: {
        title: string;
        type: TestType;
        duration: number;
        parts: Part[];
    };
    onSubmit: (data: any) => void;
    isLoading?: boolean;
}

const emptyQuestion = {
    content: '',
    options: { A: '', B: '', C: '', D: '' },
    correctOpt: '',
    explanation: '',
    imageUrl: '',
    audioUrl: '',
    transcript: '',
};

export default function TestForm({ initialData, onSubmit, isLoading }: TestFormProps) {
    const [title, setTitle] = useState(initialData?.title || '');
    const [type, setType] = useState<TestType>(initialData?.type || TestType.FULL);
    const [duration, setDuration] = useState(initialData?.duration || 7200); // 120 minutes default
    const [parts, setParts] = useState<Part[]>(initialData?.parts || []);

    const handleAddPart = () => {
        const newPartNumber = parts.length > 0 ? Math.max(...parts.map(p => p.partNumber)) + 1 : 1;
        setParts([...parts, { partNumber: newPartNumber, questions: [] }]);
    };

    const handleRemovePart = (index: number) => {
        setParts(parts.filter((_, i) => i !== index));
    };

    const handlePartNumberChange = (index: number, partNumber: number) => {
        const newParts = [...parts];
        newParts[index].partNumber = partNumber;
        setParts(newParts);
    };

    const handleAddQuestion = (partIndex: number) => {
        const newParts = [...parts];
        newParts[partIndex].questions.push({ ...emptyQuestion });
        setParts(newParts);
    };

    const handleRemoveQuestion = (partIndex: number, questionIndex: number) => {
        const newParts = [...parts];
        newParts[partIndex].questions.splice(questionIndex, 1);
        setParts(newParts);
    };

    const handleQuestionChange = (partIndex: number, questionIndex: number, question: any) => {
        const newParts = [...parts];
        newParts[partIndex].questions[questionIndex] = question;
        setParts(newParts);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!title.trim()) {
            alert('Please enter a test title');
            return;
        }

        if (parts.length === 0) {
            alert('Please add at least one part');
            return;
        }

        for (const part of parts) {
            if (part.questions.length === 0) {
                alert(`Part ${part.partNumber} must have at least one question`);
                return;
            }

            for (const question of part.questions) {
                if (!question.correctOpt) {
                    alert('All questions must have a correct option selected');
                    return;
                }
                if (!question.options.A || !question.options.B || !question.options.C || !question.options.D) {
                    alert('All questions must have all options (A, B, C, D) filled');
                    return;
                }
            }
        }

        onSubmit({
            title,
            type,
            duration,
            parts,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Test Metadata */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h2 className="text-2xl font-bold text-white mb-6">Test Information</h2>

                <div className="space-y-4">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-blue-200 mb-2">
                            Test Title *
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., TOEIC Full Test 1"
                            required
                        />
                    </div>

                    {/* Type */}
                    <div>
                        <label className="block text-sm font-medium text-blue-200 mb-2">
                            Test Type *
                        </label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value as TestType)}
                            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value={TestType.FULL}>FULL - Full test (200 questions)</option>
                            <option value={TestType.MINI}>MINI - Mini test</option>
                            <option value={TestType.PART}>PART - Practice by part</option>
                        </select>
                    </div>

                    {/* Duration */}
                    <div>
                        <label className="block text-sm font-medium text-blue-200 mb-2">
                            Duration (minutes) *
                        </label>
                        <input
                            type="number"
                            value={Math.floor(duration / 60)}
                            onChange={(e) => setDuration(parseInt(e.target.value) * 60)}
                            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="120"
                            min="1"
                            required
                        />
                    </div>
                </div>
            </div>

            {/* Parts */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">Parts & Questions</h2>
                    <button
                        type="button"
                        onClick={handleAddPart}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Add Part
                    </button>
                </div>

                {parts.length === 0 ? (
                    <div className="text-center py-12 text-blue-200">
                        <Layers className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No parts added yet. Click &quot;Add Part&quot; to start.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {parts.map((part, partIndex) => (
                            <div key={partIndex} className="bg-white/5 rounded-xl p-6 border border-white/10">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <label className="text-white font-semibold">Part Number:</label>
                                        <input
                                            type="number"
                                            value={part.partNumber}
                                            onChange={(e) => handlePartNumberChange(partIndex, parseInt(e.target.value))}
                                            className="w-20 px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            min="1"
                                            max="7"
                                            required
                                        />
                                        <span className="text-blue-200 text-sm">
                                            ({part.questions.length} questions)
                                        </span>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => handleRemovePart(partIndex)}
                                        className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Questions */}
                                <div className="space-y-4 mb-4">
                                    {part.questions.map((question, questionIndex) => (
                                        <QuestionForm
                                            key={questionIndex}
                                            question={question}
                                            onChange={(q) => handleQuestionChange(partIndex, questionIndex, q)}
                                            onRemove={() => handleRemoveQuestion(partIndex, questionIndex)}
                                            index={questionIndex}
                                        />
                                    ))}
                                </div>

                                <button
                                    type="button"
                                    onClick={() => handleAddQuestion(partIndex)}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 rounded-lg transition-colors border border-blue-500/30"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Question to Part {part.partNumber}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Save className="w-5 h-5" />
                    {isLoading ? 'Saving...' : 'Save Test'}
                </button>
            </div>
        </form>
    );
}
