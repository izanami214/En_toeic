'use client';

import { Plus, Trash2, BookOpen } from 'lucide-react';
import QuestionForm from './QuestionForm';

interface QuestionGroupFormProps {
    group: {
        title?: string;
        passage?: string;
        imageUrl?: string;
        audioUrl?: string;
        orderIndex?: number;
        questions: Array<{
            content?: string;
            options: { A: string; B: string; C: string; D: string };
            correctOpt: string;
            explanation?: string;
            imageUrl?: string;
            audioUrl?: string;
            transcript?: string;
        }>;
    };
    onChange: (group: QuestionGroupFormProps['group']) => void;
    onRemove: () => void;
    groupIndex: number;
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

export default function QuestionGroupForm({ group, onChange, onRemove, groupIndex }: QuestionGroupFormProps) {
    const handleChange = (field: string, value: string) => {
        onChange({ ...group, [field]: value });
    };

    const handleAddQuestion = () => {
        onChange({ ...group, questions: [...group.questions, { ...emptyQuestion }] });
    };

    const handleRemoveQuestion = (idx: number) => {
        onChange({ ...group, questions: group.questions.filter((_, i) => i !== idx) });
    };

    const handleQuestionChange = (idx: number, q: QuestionGroupFormProps['group']['questions'][0]) => {
        const newQs = [...group.questions];
        newQs[idx] = q;
        onChange({ ...group, questions: newQs });
    };

    return (
        <div className="bg-blue-500/10 border border-blue-400/30 rounded-2xl p-6 space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-blue-400" />
                    </div>
                    <span className="text-blue-200 font-semibold">Nhóm câu hỏi {groupIndex + 1} (Đoạn văn)</span>
                </div>
                <button
                    type="button"
                    onClick={onRemove}
                    className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            {/* Group Title */}
            <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">
                    Tiêu đề đoạn văn (Tùy chọn)
                </label>
                <input
                    type="text"
                    value={group.title || ''}
                    onChange={(e) => handleChange('title', e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder='VD: "Questions 147-150 refer to the following email."'
                />
            </div>

            {/* Passage Text */}
            <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">
                    Nội dung đoạn văn <span className="text-blue-400">*</span>
                </label>
                <textarea
                    value={group.passage || ''}
                    onChange={(e) => handleChange('passage', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-blue-400/40 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
                    rows={8}
                    placeholder="Nhập nội dung đoạn văn đọc hiểu tại đây..."
                />
            </div>

            {/* Image URL (Optional) */}
            <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">
                    Đường dẫn hình ảnh (Tùy chọn)
                </label>
                <input
                    type="text"
                    value={group.imageUrl || ''}
                    onChange={(e) => handleChange('imageUrl', e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/passage-image.jpg"
                />
            </div>

            {/* Audio URL (Optional) */}
            <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">
                    Đường dẫn Audio chung (Tùy chọn)
                </label>
                <input
                    type="text"
                    value={group.audioUrl || ''}
                    onChange={(e) => handleChange('audioUrl', e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/audio.mp3"
                />
            </div>

            {/* Questions */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h5 className="text-white font-semibold">
                        Câu hỏi ({group.questions.length})
                    </h5>
                </div>

                {group.questions.map((q, idx) => (
                    <QuestionForm
                        key={idx}
                        question={q}
                        index={idx}
                        onChange={(updated) => handleQuestionChange(idx, updated)}
                        onRemove={() => handleRemoveQuestion(idx)}
                    />
                ))}

                <button
                    type="button"
                    onClick={handleAddQuestion}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 rounded-lg transition-colors border border-blue-500/30"
                >
                    <Plus className="w-4 h-4" />
                    Thêm câu hỏi cho nhóm này
                </button>
            </div>
        </div>
    );
}
