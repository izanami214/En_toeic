'use client';

import { useAuthStore } from '@/lib/auth-store';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, user } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        // Check if we're on client side and auth state is loaded
        // zustand persist rehydrates asynchronously, so we might need a small delay or check _hasHydrated if available
        // But for simplicity, we rely on isAuthenticated state from store

        if (!isAuthenticated) {
            // Store the attempted URL to redirect back after login (optional enhancement)
            // sessionStorage.setItem('redirectUrl', pathname);
            router.push('/login');
        } else {
            setIsChecking(false);
        }
    }, [isAuthenticated, router, pathname]);

    // While checking or redirecting, show a loading spinner
    if (isChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return <>{children}</>;
}
