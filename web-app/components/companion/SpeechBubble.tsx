'use client';

import { X } from 'lucide-react';

interface SpeechBubbleProps {
    text: string;
    onClose?: () => void;
}

export default function SpeechBubble({ text, onClose }: SpeechBubbleProps) {
    return (
        <div className="relative mb-3 animate-slideIn">
            <div className="bg-white rounded-2xl shadow-xl p-4 max-w-[200px] border-2 border-blue-200">
                <p className="text-sm text-gray-700 leading-relaxed">{text}</p>

                {onClose && (
                    <button
                        onClick={onClose}
                        className="absolute -top-2 -right-2 bg-gray-100 hover:bg-gray-200 rounded-full p-1 shadow-md transition-colors"
                    >
                        <X className="w-3 h-3 text-gray-600" />
                    </button>
                )}
            </div>

            {/* Speech bubble tail */}
            <div className="absolute bottom-0 right-8 transform translate-y-1/2">
                <div className="w-4 h-4 bg-white border-r-2 border-b-2 border-blue-200 rotate-45"></div>
            </div>
        </div>
    );
}
