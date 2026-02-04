'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTests, deleteTest } from '@/lib/api';
import Link from 'next/link';
import { Plus, Edit, Trash2, Clock, Layers, FileText } from 'lucide-react';
import { useState } from 'react';

export default function TestsListPage() {
    const queryClient = useQueryClient();
    const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; testId: string; title: string }>({
        open: false,
        testId: '',
        title: '',
    });

    const { data: tests, isLoading, error } = useQuery({
        queryKey: ['tests'],
        queryFn: getTests,
    });

    const deleteMutation = useMutation({
        mutationFn: deleteTest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tests'] });
            setDeleteConfirm({ open: false, testId: '', title: '' });
        },
    });

    const handleDelete = (testId: string, title: string) => {
        setDeleteConfirm({ open: true, testId, title });
    };

    const confirmDelete = () => {
        deleteMutation.mutate(deleteConfirm.testId);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-white text-lg">Loading tests...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-500/20 backdrop-blur-lg border border-red-500/50 rounded-xl p-6">
                <p className="text-red-200">Error loading tests: {(error as Error).message}</p>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2">Tests Management</h1>
                    <p className="text-blue-200">Manage TOEIC tests, parts, and questions</p>
                </div>
                <Link
                    href="/admin/tests/new"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all"
                >
                    <Plus className="w-5 h-5" />
                    Create New Test
                </Link>
            </div>

            {tests && tests.length === 0 ? (
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 text-center border border-white/20">
                    <FileText className="w-16 h-16 text-blue-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No tests yet</h3>
                    <p className="text-blue-200 mb-6">Create your first TOEIC test to get started</p>
                    <Link
                        href="/admin/tests/new"
                        className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Create Test
                    </Link>
                </div>
            ) : (
                <div className="grid gap-6">
                    {tests?.map((test: any) => {
                        const totalQuestions = test.parts?.reduce(
                            (sum: number, part: any) => sum + (part.questions?.length || 0),
                            0
                        ) || 0;

                        return (
                            <div
                                key={test.id}
                                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <h2 className="text-2xl font-bold text-white">{test.title}</h2>
                                            <span className="px-3 py-1 bg-blue-500/30 text-blue-200 rounded-full text-sm font-semibold">
                                                {test.type}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-6 text-blue-200">
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4" />
                                                <span>{Math.floor(test.duration / 60)} minutes</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Layers className="w-4 h-4" />
                                                <span>{test.parts?.length || 0} parts</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FileText className="w-4 h-4" />
                                                <span>{totalQuestions} questions</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/admin/tests/${test.id}/edit`}
                                            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                                        >
                                            <Edit className="w-4 h-4" />
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(test.id, test.title)}
                                            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            {deleteConfirm.open && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full mx-4 border border-white/20">
                        <h3 className="text-xl font-bold text-white mb-3">Confirm Delete</h3>
                        <p className="text-blue-200 mb-6">
                            Are you sure you want to delete &quot;<strong>{deleteConfirm.title}</strong>&quot;? This action cannot be undone.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setDeleteConfirm({ open: false, testId: '', title: '' })}
                                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                                disabled={deleteMutation.isPending}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                                disabled={deleteMutation.isPending}
                            >
                                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
