import MainPage from '@/components/main';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Chord Lyrics',
    description: 'Create and view song lyrics with chords',
};

export default function Main() {
    return <MainPage />;
}
