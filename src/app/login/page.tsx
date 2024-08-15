import { Logo } from '@/assets/icons/logo';
import { UserAuthForm } from '@/components/login/user-auth-form';

export default async function Login() {
    return (
        <div className="container relative hidden h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
                <div className="absolute inset-0 bg-zinc-900">
                    <div className="w-full h-full">
                        <Logo className="w-full h-full" />
                    </div>
                </div>
                <div className="relative z-20 flex items-center text-lg font-medium">
                    Chord Lyrics
                </div>
            </div>
            <div className="lg:p-8">
                <UserAuthForm />
            </div>
        </div>
    );
}
