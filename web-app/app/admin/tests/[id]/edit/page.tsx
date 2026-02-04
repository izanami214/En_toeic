'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTestById, updateTest, deleteTest } from '@/lib/api';
import TestForm from '../../components/TestForm';
import { ArrowLeft, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function EditTestPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [deleteConfirm, setDeleteConfirm] = useState(false);

    // Unwrap params Promise for Next.js 15
    const { id } = use(params);

    const { data: test, isLoading, error } = useQuery({
        queryKey: ['test', id],
        queryFn: () => getTestById(id),
    });

    const updateMutation = useMutation({
        mutationFn: (data: any) => updateTest(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tests'] });
            queryClient.invalidateQueries({ queryKey: ['test', id] });
            router.push('/admin/tests');
        },
        onError: (error: any) => {
            alert(`Error updating test: ${error.message}`);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: () => deleteTest(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tests'] });
            router.push('/admin/tests');
        },
        onError: (error: any) => {
            alert(`Error deleting test: ${error.message}`);
        },
    });

    const handleSubmit = (data: any) => {
        updateMutation.mutate(data);
    };

    const handleDelete = () => {
        setDeleteConfirm(true);
    };

    const confirmDelete = () => {
        deleteMutation.mutate();
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-white text-lg">Loading test...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-500/20 backdrop-blur-lg border border-red-500/50 rounded-xl p-6">
                <p className="text-red-200">Error loading test: {(error as Error).message}</p>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6">
                <Link
                    href="/admin/tests"
                    className="inline-flex items-center gap-2 text-blue-200 hover:text-white transition-colors mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Tests
                </Link>
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">Edit Test</h1>
                        <p className="text-blue-200">Update test information, parts, and questions</p>
                    </div>
                    <button
                        onClick={handleDelete}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete Test
                    </button>
                </div>
            </div>

            {test && (
                <TestForm
                    initialData={test}
                    onSubmit={handleSubmit}
                    isLoading={updateMutation.isPending}
                />
            )}

            {/* Delete Confirmation Dialog */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full mx-4 border border-white/20">
                        <h3 className="text-xl font-bold text-white mb-3">Confirm Delete</h3>
                        <p className="text-blue-200 mb-6">
                            Are you sure you want to delete this test? This action cannot be undone.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setDeleteConfirm(false)}
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
