import MainPage from '@/components/main';
import { AiChatFab } from '@/components/ai/AiChatFab';
import { AiPromoBanner } from '@/components/ai/AiPromoBanner';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Chord Lyrics',
    description: 'Create and view song lyrics with chords',
};

export default function Main() {
    return (
        <div className="flex flex-col h-screen">
            <AiPromoBanner />
            <div className="flex-1 overflow-hidden relative">
                <MainPage />
                <AiChatFab />
            </div>
        </div>
    );
}
