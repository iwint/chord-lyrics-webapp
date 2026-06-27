'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bot, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';

export function AiPromoBanner() {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const router = useRouter();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            const dismissed = localStorage.getItem('ai_promo_dismissed');
            if (!dismissed) {
                setIsVisible(true);
            }
        } else {
            setIsVisible(false);
        }
    }, [isAuthenticated]);

    if (!isVisible) return null;

    const handleDismiss = () => {
        localStorage.setItem('ai_promo_dismissed', 'true');
        setIsVisible(false);
    };

    return (
        <div className="bg-primary/10 border-b border-primary/20 text-foreground px-4 py-3 flex items-center gap-3 relative z-50">
            <div className="bg-primary/20 p-2 rounded-full text-primary shrink-0">
                <Bot className="w-5 h-5" />
            </div>
            <div className="flex-1 text-sm">
                <span className="font-bold text-primary">Unlock AI Magic!</span> Login to instantly generate chords, lyrics, and song metadata.
            </div>
            <Button
                size="sm"
                className="shrink-0 h-8 text-xs px-4 rounded-full font-bold shadow-sm"
                onClick={() => router.push('/sign-in')}
            >
                Login
            </Button>
            <button 
                onClick={handleDismiss}
                className="text-muted-foreground hover:text-foreground transition-colors ml-2"
                aria-label="Dismiss banner"
            >
                <X className="w-5 h-5" />
            </button>
        </div>
    );
}
