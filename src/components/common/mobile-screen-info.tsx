import { Logo } from '@/assets/icons/logo';
import Link from 'next/link';
import React from 'react';
import { buttonVariants } from '../ui/button';

interface MobileScreenInfoProps {}

const MobileScreenInfo: React.FC<MobileScreenInfoProps> = ({}) => {
    return (
        <div className="h-screen flex md:hidden bg-gray-100 lg:hidden 2xl:hidden xl:hidden items-center justify-center w-screen">
            <div className='flex flex-col items-center justify-center gap-4'>
                <div className='flex flex-col items-center gap-2 justify-center'>
                <Logo className='w-2/6 h-2/6' />
                <div className='text-3xl font-semibold'>Chord Lyrics</div>
                </div>
                <div className='text-center w-[90%]'>
                    For mobile version. Please click the below button to download
                    out mobile app.
                </div>
                <Link className={buttonVariants({variant:"default"})} href={''}>Download</Link>
            </div>
        </div>
    );
};

export default MobileScreenInfo;
