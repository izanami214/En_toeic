'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import MascotAvatar from './MascotAvatar';
import SpeechBubble from './SpeechBubble';
import ChatWidget from './ChatWidget';

export default function AICompanion() {
    const [isOpen, setIsOpen] = useState(false);
    const [showBubble, setShowBubble] = useState(true);
    const [message, setMessage] = useState('Chào bạn! Sẵn sàng học chưa?');
    const [mascotState, setMascotState] = useState<'idle' | 'thinking' | 'happy' | 'sleeping' | 'confused' | 'celebrating'>('idle');
    const pathname = usePathname();
    const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Contextual messages based on route
    useEffect(() => {
        const messages: Record<string, string> = {
            '/': 'Hôm nay học gì nào? 😊',
            '/tests': 'Chọn đề phù hợp với trình độ nhé!',
            '/history': 'Wow! Tiến bộ đấy! 🎉',
            '/flashcards': 'Ganbatte! Học từ vựng thôi!',
        };

        const contextMessage = messages[pathname] || 'Cần trợ giúp không? 🤖';
        setMessage(contextMessage);
        setShowBubble(true);

        // Auto-hide bubble after 5 seconds
        const timer = setTimeout(() => setShowBubble(false), 5000);
        return () => clearTimeout(timer);
    }, [pathname]);

    // Idle timer - set to sleeping after 2 minutes of inactivity
    useEffect(() => {
        const resetIdleTimer = () => {
            // Clear existing timer
            if (idleTimerRef.current) {
                clearTimeout(idleTimerRef.current);
            }

            // Wake up if sleeping
            if (mascotState === 'sleeping') {
                setMascotState('idle');
            }

            // Set new timer for 2 minutes (120000 ms)
            idleTimerRef.current = setTimeout(() => {
                if (!isOpen) {
                    setMascotState('sleeping');
                    setShowBubble(false);
                }
            }, 120000); // 2 minutes
        };

        // Listen to user activity
        const events = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart', 'click'];
        events.forEach((event) => {
            window.addEventListener(event, resetIdleTimer);
        });

        // Initialize timer
        resetIdleTimer();

        return () => {
            events.forEach((event) => {
                window.removeEventListener(event, resetIdleTimer);
            });
            if (idleTimerRef.current) {
                clearTimeout(idleTimerRef.current);
            }
        };
    }, [mascotState, isOpen]);

    const handleToggle = () => {
        setIsOpen(!isOpen);
        setShowBubble(false);
        setMascotState(isOpen ? 'idle' : 'happy');
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Widget */}
            {isOpen && <ChatWidget onClose={() => setIsOpen(false)} />}

            {/* Speech Bubble */}
            {!isOpen && showBubble && (
                <SpeechBubble
                    text={message}
                    onClose={() => setShowBubble(false)}
                />
            )}

            {/* Mascot Button */}
            <button
                onClick={handleToggle}
                className="hover:scale-110 transition-transform focus:outline-none focus:ring-4 focus:ring-blue-300 rounded-full"
                aria-label="Toggle AI Assistant"
            >
                <MascotAvatar state={mascotState} />
            </button>
        </div>
    );
}
