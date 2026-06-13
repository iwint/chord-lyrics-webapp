import { Logo } from '@/assets/icons/logo';
import MobileScreenInfo from '@/components/common/mobile-screen-info';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <div className="container relative hidden h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
                <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
                    <div className="absolute inset-0 bg-zinc-900">
                        <div className="w-full h-full">
                            <Logo className="w-full h-full" />
                        </div>
                    </div>
                    <div className="relative z-20 gap-4 flex items-center text-lg font-medium">
                        <Link href="/" className="hover:opacity-60 transition">
                            <ArrowLeft />
                        </Link>
                        <span>Chord Lyrics</span>
                    </div>
                </div>
                <div className="lg:p-8 w-full flex justify-center">
                    {children}
                </div>
            </div>
            <MobileScreenInfo />
        </>
    );
}
