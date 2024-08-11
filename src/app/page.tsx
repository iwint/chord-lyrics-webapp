import { Metadata } from 'next';

import { UserAuthForm } from '@/components/login/user-auth-form';

export const metadata: Metadata = {
    title: 'Authentication',
    description: 'Authentication forms built using the components.',
};

export default function AuthenticationPage() {
    return (
        <>
            <div className="container relative hidden h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
                <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
                    <div className="absolute inset-0 bg-zinc-900" />
                    <div className="relative z-20 flex items-center text-lg font-medium">
                        Chord Lyrics
                    </div>
                </div>
                <div className="lg:p-8">
                    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                        <div className="flex flex-col space-y-2 text-start">
                            <h1 className="text-2xl font-semibold tracking-tight">
                                Sign in
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Enter your details to sign in to your account
                            </p>
                        </div>
                        <UserAuthForm />
                    </div>
                </div>
            </div>
        </>
    );
}
