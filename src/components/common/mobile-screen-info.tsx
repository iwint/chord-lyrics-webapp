import Image from 'next/image';
import LogoImg from '@/assets/images/logo.png';
import Link from 'next/link';
import React from 'react';
import { buttonVariants } from '../ui/button';

import { cn } from '@/lib/utils';

interface MobileScreenInfoProps {}

const MobileScreenInfo: React.FC<MobileScreenInfoProps> = ({}) => {
    return (
        <div className="h-screen flex md:hidden bg-gradient-to-b from-background via-background/95 to-primary/5 lg:hidden 2xl:hidden xl:hidden items-center justify-center w-screen px-6">
            <div className="flex flex-col items-center justify-center gap-6 p-8 rounded-3xl bg-card border border-border/50 shadow-xl max-w-sm text-center relative overflow-hidden backdrop-blur-sm">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -z-10" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -z-10" />

                <div className="flex flex-col items-center gap-3 justify-center">
                    <div className="bg-primary/10 p-4 rounded-2xl shadow-inner border border-primary/20">
                        <Image src={LogoImg} alt="Chord Lyrics Logo" width={64} height={64} className="object-contain" />
                    </div>
                    <div className="text-3xl font-extrabold tracking-tight text-foreground mt-2">
                        Chord Lyrics
                    </div>
                </div>

                <div className="text-sm text-muted-foreground leading-relaxed px-2">
                    For the best experience, download our mobile app to view chords and lyrics on the go!
                </div>

                <Link
                    className={cn(
                        buttonVariants({ variant: "default" }),
                        "w-full h-11 rounded-full font-bold shadow-md bg-gradient-to-r from-primary to-primary/90 hover:opacity-95 transition-all text-primary-foreground"
                    )}
                    target='_blank'
                    href="https://drive.google.com/file/d/1CocZHUCA-uoPG9_7BpiBF8Pwtp47IGzu/view?usp=sharing"
                >
                    Download App
                </Link>
            </div>
        </div>
    );
};

export default MobileScreenInfo;
