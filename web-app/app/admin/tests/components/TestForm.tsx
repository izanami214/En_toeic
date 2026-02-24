'use client';

import { useState } from 'react';
import { Plus, Trash2, Save, Layers, FileText, BookOpen } from 'lucide-react';
import QuestionForm from './QuestionForm';
import QuestionGroupForm from './QuestionGroupForm';
import { TestType } from '@/lib/types';

interface Question {
    content?: string;
    options: { A: string; B: string; C: string; D: string };
    correctOpt: string;
    explanation?: string;
    imageUrl?: string;
    audioUrl?: string;
    transcript?: string;
    orderIndex?: number;
}

interface QuestionGroup {
    title?: string;
    passage?: string;
    imageUrl?: string;
    audioUrl?: string;
    orderIndex?: number;
    questions: Question[];
}

interface Part {
    partNumber: number;
    questions: Question[];   // standalone
    groups: QuestionGroup[]; // passage groups
}

interface TestFormProps {
    initialData?: {
        title: string;
        type: TestType;
        duration: number;
        parts: Part[];
    };
    onSubmit: (data: Record<string, unknown>) => void;
    isLoading?: boolean;
}

const emptyQuestion: Question = {
    content: '',
    options: { A: '', B: '', C: '', D: '' },
    correctOpt: '',
    explanation: '',
    imageUrl: '',
    audioUrl: '',
    transcript: '',
};

const emptyGroup: QuestionGroup = {
    title: '',
    passage: '',
    imageUrl: '',
    audioUrl: '',
    questions: [],
};

export default function TestForm({ initialData, onSubmit, isLoading }: TestFormProps) {
    const [title, setTitle] = useState(initialData?.title || '');
    const [type, setType] = useState<TestType>(initialData?.type || TestType.FULL);
    const [duration, setDuration] = useState(initialData?.duration || 7200);
    const [parts, setParts] = useState<Part[]>(
        initialData?.parts?.map(p => ({
            ...p,
            questions: p.questions || [],
            groups: p.groups || [],
        })) || []
    );

    // ── Part handlers ──────────────────────────────────────────
    const handleAddPart = () => {
        const nextNum = parts.length > 0 ? Math.max(...parts.map(p => p.partNumber)) + 1 : 1;
        setParts([...parts, { partNumber: nextNum, questions: [], groups: [] }]);
    };

    const handleRemovePart = (i: number) => setParts(parts.filter((_, idx) => idx !== i));

    const handlePartNumberChange = (i: number, val: number) => {
        const next = [...parts];
        next[i].partNumber = val;
        setParts(next);
    };

    // ── Standalone Question handlers ────────────────────────────
    const handleAddQuestion = (pi: number) => {
        const next = [...parts];
        next[pi].questions.push({ ...emptyQuestion });
        setParts(next);
    };

    const handleRemoveQuestion = (pi: number, qi: number) => {
        const next = [...parts];
        next[pi].questions.splice(qi, 1);
        setParts(next);
    };

    const handleQuestionChange = (pi: number, qi: number, q: Question) => {
        const next = [...parts];
        next[pi].questions[qi] = q;
        setParts(next);
    };

    // ── Group handlers ─────────────────────────────────────────
    const handleAddGroup = (pi: number) => {
        const next = [...parts];
        next[pi].groups.push({ ...emptyGroup, questions: [] });
        setParts(next);
    };

    const handleRemoveGroup = (pi: number, gi: number) => {
        const next = [...parts];
        next[pi].groups.splice(gi, 1);
        setParts(next);
    };

    const handleGroupChange = (pi: number, gi: number, g: QuestionGroup) => {
        const next = [...parts];
        next[pi].groups[gi] = g;
        setParts(next);
    };

    // ── Submit ─────────────────────────────────────────────────
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) { alert('Vui lòng nhập tên đề thi'); return; }
        if (parts.length === 0) { alert('Vui lòng thêm ít nhất một phần thi'); return; }

        for (const part of parts) {
            const allGroupsHaveQuestions = part.groups.every(g => g.questions.length > 0);
            if (!allGroupsHaveQuestions) {
                alert(`Part ${part.partNumber}: Mỗi nhóm câu hỏi phải có ít nhất 1 câu hỏi`);
                return;
            }
            const allQs = [
                ...part.questions,
                ...part.groups.flatMap(g => g.questions),
            ];
            if (allQs.length === 0) {
                alert(`Part ${part.partNumber} phải có ít nhất một câu hỏi`);
                return;
            }
            for (const q of allQs) {
                if (!q.correctOpt) { alert('Tất cả câu hỏi phải có đáp án đúng'); return; }
                if (!q.options.A || !q.options.B || !q.options.C || !q.options.D) {
                    alert('Tất cả các lựa chọn A, B, C, D phải được điền'); return;
                }
            }
        }

        onSubmit({ title, type, duration, parts });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* ─ Test Metadata ─ */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h2 className="text-2xl font-bold text-white mb-6">Thông tin đề thi</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-blue-200 mb-2">Tên đề thi *</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="VD: TOEIC Full Test 1" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-blue-200 mb-2">Loại đề *</label>
                        <select value={type} onChange={(e) => setType(e.target.value as TestType)}
                            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                            <option value={TestType.FULL}>FULL – Đề đầy đủ (200 câu)</option>
                            <option value={TestType.MINI}>MINI – Đề ngắn</option>
                            <option value={TestType.PART}>PART – Luyện theo phần</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-blue-200 mb-2">Thời gian làm bài (phút) *</label>
                        <input type="number" value={Math.floor(duration / 60)}
                            onChange={(e) => setDuration(parseInt(e.target.value) * 60)}
                            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="120" min="1" required />
                    </div>
                </div>
            </div>

            {/* ─ Parts ─ */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">Phần thi & Câu hỏi</h2>
                    <button type="button" onClick={handleAddPart}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                        <Plus className="w-4 h-4" /> Thêm phần thi
                    </button>
                </div>

                {parts.length === 0 ? (
                    <div className="text-center py-12 text-blue-200">
                        <Layers className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>Chưa có phần thi nào. Nhấn &quot;Thêm phần thi&quot; để bắt đầu.</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {parts.map((part, pi) => (
                            <div key={pi} className="bg-white/5 rounded-xl p-6 border border-white/10 space-y-6">
                                {/* Part Header */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <label className="text-white font-semibold">Phần số:</label>
                                        <input type="number" value={part.partNumber}
                                            onChange={(e) => handlePartNumberChange(pi, parseInt(e.target.value))}
                                            className="w-20 px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            min="1" max="7" required />
                                        <span className="text-blue-200 text-sm">
                                            ({part.questions.length + part.groups.reduce((s, g) => s + g.questions.length, 0)} câu hỏi)
                                        </span>
                                    </div>
                                    <button type="button" onClick={() => handleRemovePart(pi)}
                                        className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Standalone Questions */}
                                {part.questions.length > 0 && (
                                    <div className="space-y-4">
                                        <h4 className="text-white font-medium flex items-center gap-2">
                                            <FileText className="w-4 h-4 text-blue-400" /> Câu hỏi đơn lẻ
                                        </h4>
                                        {part.questions.map((q, qi) => (
                                            <QuestionForm key={qi} question={q} index={qi}
                                                onChange={(updated) => handleQuestionChange(pi, qi, updated)}
                                                onRemove={() => handleRemoveQuestion(pi, qi)} />
                                        ))}
                                    </div>
                                )}

                                {/* Question Groups */}
                                {part.groups.length > 0 && (
                                    <div className="space-y-4">
                                        <h4 className="text-white font-medium flex items-center gap-2">
                                            <BookOpen className="w-4 h-4 text-blue-400" /> Nhóm câu hỏi đọc hiểu
                                        </h4>
                                        {part.groups.map((g, gi) => (
                                            <QuestionGroupForm key={gi} group={g} groupIndex={gi}
                                                onChange={(updated) => handleGroupChange(pi, gi, updated)}
                                                onRemove={() => handleRemoveGroup(pi, gi)} />
                                        ))}
                                    </div>
                                )}

                                {/* Add Buttons */}
                                <div className="grid grid-cols-2 gap-3">
                                    <button type="button" onClick={() => handleAddQuestion(pi)}
                                        className="flex items-center justify-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/15 text-blue-200 rounded-lg border border-white/20 transition-colors">
                                        <FileText className="w-4 h-4" /> Thêm câu đơn lẻ
                                    </button>
                                    <button type="button" onClick={() => handleAddGroup(pi)}
                                        className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 rounded-lg border border-blue-500/30 transition-colors">
                                        <BookOpen className="w-4 h-4" /> Thêm nhóm đoạn văn
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Submit */}
            <div className="flex justify-end">
                <button type="submit" disabled={isLoading}
                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                    <Save className="w-5 h-5" />
                    {isLoading ? 'Đang lưu...' : 'Lưu đề thi'}
                </button>
            </div>
        </form>
    );
}
