'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFlashcardsDue, reviewFlashcard, getFlashcardStats, learnNewCards } from '@/lib/api';
import { useState } from 'react';
import { ArrowLeft, RotateCcw, BookOpen, Brain, TrendingUp, Plus } from 'lucide-react';
import Link from 'next/link';

import { useAuthStore } from '@/lib/auth-store';

export default function FlashcardsPage() {
    const { user } = useAuthStore();
    const userId = user?.id || '';
    const queryClient = useQueryClient();
    const [isReviewing, setIsReviewing] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    const { data: cards, isLoading: isLoadingCards } = useQuery({
        queryKey: ['flashcards', userId],
        queryFn: () => getFlashcardsDue(userId),
        enabled: !!userId,
    });

    const { data: stats, isLoading: isLoadingStats } = useQuery({
        queryKey: ['flashcard-stats', userId],
        queryFn: () => getFlashcardStats(userId),
        enabled: !!userId,
    });

    const learnMutation = useMutation({
        mutationFn: (count: number) => learnNewCards(userId, count),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['flashcards', userId] });
            queryClient.invalidateQueries({ queryKey: ['flashcard-stats', userId] });
        },
    });

    const reviewMutation = useMutation({
        mutationFn: ({ flashcardId, rating }: { flashcardId: string; rating: number }) =>
            reviewFlashcard(userId, flashcardId, rating),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['flashcards', userId] });
            queryClient.invalidateQueries({ queryKey: ['flashcard-stats', userId] });
            setCurrentIndex((prev) => prev + 1);
            setIsFlipped(false);
        },
    });

    const handleReview = (rating: number) => {
        if (cards && cards[currentIndex]) {
            reviewMutation.mutate({
                flashcardId: cards[currentIndex].flashcardId,
                rating,
            });
        }
    };

    const handleStartLearning = () => {
        learnMutation.mutate(5); // Learn 5 new words
    };

    if (isLoadingCards || isLoadingStats) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                <div className="text-lg text-white">Loading...</div>
            </div>
        );
    }

    // REVIEW MODE
    if (isReviewing && cards && cards.length > 0 && currentIndex < cards.length) {
        const currentCard = cards[currentIndex];
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
                <div className="max-w-2xl mx-auto">
                    <div className="flex items-center justify-between mb-6 text-white">
                        <button
                            onClick={() => setIsReviewing(false)}
                            className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Return to Dashboard
                        </button>
                        <div className="text-blue-200">
                            {currentIndex + 1} / {cards.length}
                        </div>
                    </div>

                    {/* Flashcard Area */}
                    <div
                        className="relative min-h-[400px] cursor-pointer group"
                        onClick={() => setIsFlipped(!isFlipped)}
                    >
                        <div className={`
                            w-full h-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden transition-all duration-500
                            ${isFlipped ? 'ring-2 ring-blue-500/50 bg-white/15' : 'hover:bg-white/15 hover:scale-[1.01]'}
                        `}>
                            {/* Card Content - Stacked Approach instead of Flip */}
                            <div className="p-12 flex flex-col items-center justify-center min-h-[400px]">
                                {/* Always Visible: WORD */}
                                <div className="text-center mb-8">
                                    <span className="inline-block text-sm text-blue-300 font-medium bg-blue-500/10 px-3 py-1 rounded-full mb-4">
                                        Term
                                    </span>
                                    <h2 className="text-5xl font-bold text-white tracking-tight">
                                        {currentCard.flashcard.word}
                                    </h2>
                                </div>

                                {/* Hidden Content - Revealed on Click */}
                                <div className={`
                                    flex flex-col items-center w-full transition-all duration-500 ease-in-out
                                    ${isFlipped ? 'opacity-100 translate-y-0 max-h-[500px]' : 'opacity-0 translate-y-4 max-h-0 overflow-hidden'}
                                `}>
                                    {/* Pronunciation */}
                                    {currentCard.flashcard.pronunciation && (
                                        <div className="mb-8">
                                            <span className="text-2xl text-blue-200 font-mono bg-black/20 px-6 py-2 rounded-xl border border-white/5">
                                                {currentCard.flashcard.pronunciation}
                                            </span>
                                        </div>
                                    )}
                                    {currentCard.flashcard.example && (
                                        <div className="w-full bg-black/20 rounded-xl p-6 border border-white/5 animate-in fade-in slide-in-from-bottom-3 duration-700 delay-200 fill-mode-forwards">
                                            <div className="flex gap-3">
                                                <div className="mt-1 w-1 h-full bg-blue-500 rounded-full min-h-[24px]"></div>
                                                <div className="text-left">
                                                    <div className="text-xs text-blue-300 font-bold uppercase tracking-wider mb-1">Example</div>
                                                    <p className="text-lg text-white/90 italic font-medium leading-relaxed">
                                                        "{currentCard.flashcard.example}"
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Prompt to Tap (Only when hidden) */}
                                {!isFlipped ? (
                                    <div className="mt-8 flex flex-col items-center animate-pulse">
                                        <div className="text-blue-200/60 text-sm font-medium uppercase tracking-widest">
                                            Tap to reveal meaning
                                        </div>
                                        <div className="mt-2 text-blue-200/40">
                                            👇
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mt-8 flex flex-col items-center animate-pulse opacity-50 hover:opacity-100 transition-opacity">
                                        <div className="text-blue-200/40 text-xs font-medium uppercase tracking-widest">
                                            Tap to collapse
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Navigation & Controls */}
                    <div className="mt-8">
                        {!isFlipped ? (
                            <div className="flex items-center justify-center gap-4">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (currentIndex > 0) {
                                            setCurrentIndex(prev => prev - 1);
                                            setIsFlipped(false);
                                        }
                                    }}
                                    disabled={currentIndex === 0}
                                    className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-xl transition-all font-medium"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                    Previous
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (currentIndex < cards.length - 1) {
                                            setCurrentIndex(prev => prev + 1);
                                            setIsFlipped(false);
                                        }
                                    }}
                                    disabled={currentIndex === cards.length - 1}
                                    className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-xl transition-all font-medium"
                                >
                                    Next
                                    <ArrowLeft className="w-5 h-5 rotate-180" />
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-4 gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                {[
                                    { val: 1, label: 'Again', desc: '< 1 min', color: 'bg-red-500' },
                                    { val: 2, label: 'Hard', desc: '5 min', color: 'bg-orange-500' },
                                    { val: 3, label: 'Good', desc: '1 day', color: 'bg-blue-500' },
                                    { val: 4, label: 'Easy', desc: '4 days', color: 'bg-green-500' }
                                ].map((btn) => (
                                    <button
                                        key={btn.val}
                                        onClick={() => handleReview(btn.val)}
                                        className={`${btn.color} hover:brightness-110 text-white py-4 px-2 rounded-xl transition-all hover:-translate-y-1 shadow-lg shadow-black/20 group`}
                                    >
                                        <div className="font-bold text-lg mb-1">{btn.label}</div>
                                        <div className="text-xs text-white/80 font-medium bg-black/20 rounded-full py-1 px-2 mx-auto w-fit group-hover:bg-black/30">
                                            {btn.desc}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>


            </div>

        );
    }

    // DASHBOARD MODE
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <Link href="/" className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        Back to Home
                    </Link>
                    <h1 className="text-3xl font-bold text-white">Vocabulary Review</h1>
                </div>

                {/* Stats Grid */}
                {stats && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-blue-500/20 text-blue-300">
                                    <BookOpen className="w-5 h-5" />
                                </div>
                                <div className="text-sm text-blue-200">Processing</div>
                            </div>
                            <div className="text-2xl font-bold text-white">
                                {stats.new + stats.learning + stats.review} / {stats.total}
                            </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-green-500/20 text-green-300">
                                    <Brain className="w-5 h-5" />
                                </div>
                                <div className="text-sm text-blue-200">Due Today</div>
                            </div>
                            <div className="text-2xl font-bold text-white">{stats.due}</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-purple-500/20 text-purple-300">
                                    <TrendingUp className="w-5 h-5" />
                                </div>
                                <div className="text-sm text-blue-200">Learned</div>
                            </div>
                            <div className="text-2xl font-bold text-white">{stats.review}</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-orange-500/20 text-orange-300">
                                    <RotateCcw className="w-5 h-5" />
                                </div>
                                <div className="text-sm text-blue-200">Learning</div>
                            </div>
                            <div className="text-2xl font-bold text-white">{stats.learning}</div>
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Review Action */}
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 flex flex-col items-center text-center hover:bg-white/15 transition-all">
                        <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                            <Brain className="w-8 h-8 text-green-300" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Review Due Words</h2>
                        {cards && cards.length > 0 ? (
                            <>
                                <p className="text-blue-200 mb-6">You have {cards.length} cards scheduled for review now.</p>
                                <button
                                    onClick={() => {
                                        setCurrentIndex(0);
                                        setIsReviewing(true);
                                    }}
                                    className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold transition-colors shadow-lg shadow-green-500/20"
                                >
                                    Start Review Session
                                </button>
                            </>
                        ) : (
                            <p className="text-blue-200 mt-2">No words due for review right now. Great job!</p>
                        )}
                    </div>

                    {/* Learn New Action */}
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 flex flex-col items-center text-center hover:bg-white/15 transition-all">
                        <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
                            <Plus className="w-8 h-8 text-blue-300" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Learn New Words</h2>
                        <p className="text-blue-200 mb-6">Expand your vocabulary specifically for TOEIC.</p>
                        <button
                            onClick={handleStartLearning}
                            disabled={learnMutation.isPending}
                            className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-colors shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {learnMutation.isPending ? 'Adding words...' : 'Learn 5 New Words'}
                        </button>
                    </div>
                </div>
            </div>


        </div>
    );
}
