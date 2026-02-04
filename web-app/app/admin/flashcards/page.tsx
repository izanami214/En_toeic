'use client';

import { useQuery } from '@tanstack/react-query';
import { BookOpen, Plus, Search } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

// Fetch all flashcards from backend
async function getAllFlashcards() {
    const response = await fetch('http://localhost:3000/flashcards/all');
    if (!response.ok) throw new Error('Failed to fetch flashcards');
    return response.json();
}

export default function AdminFlashcardsPage() {
    const [searchQuery, setSearchQuery] = useState('');

    const { data: flashcards, isLoading, error } = useQuery({
        queryKey: ['admin-flashcards'],
        queryFn: getAllFlashcards,
    });

    const filteredFlashcards = flashcards?.filter((card: any) =>
        card.word?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.definition?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-white text-lg">Loading flashcards...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-500/20 backdrop-blur-lg border border-red-500/50 rounded-xl p-6">
                <p className="text-red-200">Error loading flashcards: {(error as Error).message}</p>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">Flashcard Management</h1>
                <p className="text-blue-200">Manage TOEIC vocabulary flashcards</p>
            </div>

            {/* Stats & Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-blue-300" />
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-white">{flashcards?.length || 0}</div>
                            <div className="text-blue-200 text-sm">Total Flashcards</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                            <Search className="w-6 h-6 text-green-300" />
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-white">{filteredFlashcards?.length || 0}</div>
                            <div className="text-blue-200 text-sm">Filtered Results</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 flex items-center justify-center">
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                        <Plus className="w-5 h-5" />
                        Add New Flashcard
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-300" />
                    <input
                        type="text"
                        placeholder="Search by word or definition..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Flashcards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFlashcards?.map((card: any) => (
                    <div
                        key={card.id}
                        className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all"
                    >
                        <div className="mb-4">
                            <div className="text-2xl font-bold text-white mb-2">{card.word}</div>
                            {card.pronunciation && (
                                <div className="text-sm text-blue-300 mb-2">{card.pronunciation}</div>
                            )}
                            <div className="text-blue-200">{card.definition}</div>
                        </div>

                        {card.example && (
                            <div className="mt-4 pt-4 border-t border-white/10">
                                <div className="text-sm text-blue-300 italic">
                                    "{card.example}"
                                </div>
                            </div>
                        )}

                        <div className="mt-4 flex gap-2">
                            <button className="flex-1 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 rounded-lg text-sm transition-colors">
                                Edit
                            </button>
                            <button className="flex-1 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-lg text-sm transition-colors">
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredFlashcards?.length === 0 && (
                <div className="text-center py-12">
                    <BookOpen className="w-16 h-16 mx-auto mb-4 text-blue-300" />
                    <p className="text-xl text-blue-200">No flashcards found</p>
                    <p className="text-blue-300 mt-2">Try adjusting your search query</p>
                </div>
            )}
        </div>
    );
}
