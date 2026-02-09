'use client';

import { Bot, Heart, Loader2, HelpCircle, Sparkles } from 'lucide-react';

interface MascotAvatarProps {
    state?: 'idle' | 'thinking' | 'happy' | 'sleeping' | 'confused' | 'celebrating';
    size?: number;
}

export default function MascotAvatar({ state = 'idle', size = 80 }: MascotAvatarProps) {
    return (
        <div
            className="relative flex items-center justify-center"
            style={{ width: size, height: size }}
        >
            {/* Robot Body */}
            <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl shadow-2xl p-4 animate-float">
                {/* Face Screen */}
                <div className="bg-blue-100 rounded-2xl p-3 relative overflow-hidden">
                    {/* Eyes based on state */}
                    {state === 'idle' && (
                        <div className="flex gap-3 justify-center">
                            <div className="w-3 h-3 bg-blue-600 rounded-full animate-blink"></div>
                            <div className="w-3 h-3 bg-blue-600 rounded-full animate-blink"></div>
                        </div>
                    )}

                    {state === 'thinking' && (
                        <div className="flex items-center justify-center">
                            <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                        </div>
                    )}

                    {state === 'happy' && (
                        <div className="flex flex-col items-center gap-1">
                            <div className="flex gap-3">
                                <div className="w-2 h-1 bg-blue-600 rounded-full"></div>
                                <div className="w-2 h-1 bg-blue-600 rounded-full"></div>
                            </div>
                            <Heart className="w-4 h-4 text-pink-500 fill-pink-500 animate-pulse" />
                        </div>
                    )}

                    {state === 'sleeping' && (
                        <div className="flex flex-col items-center gap-1">
                            <div className="flex gap-3">
                                <div className="w-3 h-1 bg-blue-600 rounded-full"></div>
                                <div className="w-3 h-1 bg-blue-600 rounded-full"></div>
                            </div>
                            <div className="absolute -top-1 -right-2 flex flex-col gap-1 animate-floatSlow">
                                <span className="text-xs">💤</span>
                            </div>
                        </div>
                    )}

                    {state === 'confused' && (
                        <div className="flex items-center justify-center">
                            <HelpCircle className="w-6 h-6 text-blue-600 animate-bounce" />
                        </div>
                    )}

                    {state === 'celebrating' && (
                        <div className="relative flex flex-col items-center gap-1">
                            <div className="flex gap-3">
                                <div className="w-2 h-1 bg-blue-600 rounded-full"></div>
                                <div className="w-2 h-1 bg-blue-600 rounded-full"></div>
                            </div>
                            <Sparkles className="w-5 h-5 text-yellow-400 fill-yellow-400 animate-spin" />
                            {/* Confetti particles */}
                            <div className="absolute inset-0 pointer-events-none">
                                <div className="absolute top-0 left-0 w-1 h-1 bg-red-500 rounded-full animate-confetti1"></div>
                                <div className="absolute top-0 right-0 w-1 h-1 bg-blue-500 rounded-full animate-confetti2"></div>
                                <div className="absolute bottom-0 left-1/2 w-1 h-1 bg-green-500 rounded-full animate-confetti3"></div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Robot Icon Badge */}
                <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-lg">
                    <Bot className="w-4 h-4 text-blue-600" />
                </div>
            </div>
        </div>
    );
}
