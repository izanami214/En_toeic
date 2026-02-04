'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTest } from '@/lib/api';
import { useRouter } from 'next/navigation';
import TestForm from '../components/TestForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewTestPage() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: createTest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tests'] });
            router.push('/admin/tests');
        },
        onError: (error: any) => {
            alert(`Error creating test: ${error.message}`);
        },
    });

    const handleSubmit = (data: any) => {
        createMutation.mutate(data);
    };

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
                <h1 className="text-4xl font-bold text-white mb-2">Create New Test</h1>
                <p className="text-blue-200">Add a new TOEIC test with parts and questions</p>
            </div>

            <TestForm onSubmit={handleSubmit} isLoading={createMutation.isPending} />
        </div>
    );
}
