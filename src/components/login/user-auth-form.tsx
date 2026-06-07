'use client';

import { Icons } from '@/assets/icons/spinner-icon';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useToast } from '../ui/use-toast';

// Redux
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/lib/store/slices/authSlice';
import {
    useSignInMutation,
    useSignUpMutation,
    useVerifyOtpMutation,
} from '@/lib/store/api/authApi';

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
    const [currentPage, setCurrentPage] = React.useState<'sign-in' | 'sign-up' | 'otp'>('sign-in');
    const [userId, setUserId] = React.useState<string | null>(null);
    const router = useRouter();
    const { toast } = useToast();
    const dispatch = useDispatch();

    const [signIn, { isLoading: isSigningIn }] = useSignInMutation();
    const [signUp, { isLoading: isSigningUp }] = useSignUpMutation();
    const [verifyOtp, { isLoading: isVerifyingOtp }] = useVerifyOtpMutation();

    const isLoading = isSigningIn || isSigningUp || isVerifyingOtp;

    async function onSubmit(formData: FormData) {
        if (currentPage === 'otp') {
            const otp = formData.get('otp') as string;
            if (!userId || !otp) return;

            try {
                const res = await verifyOtp({ user_id: userId, otp }).unwrap();
                if (res.access_token) {
                    dispatch(setCredentials({ user: res, token: res.access_token }));
                    toast({ title: 'Successfully verified and logged in!' });
                    router.replace('/');
                }
            } catch (err: any) {
                toast({
                    variant: 'destructive',
                    title: 'Verification failed',
                    description: err?.data?.message || 'Invalid OTP',
                });
            }
            return;
        }

        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const name = formData.get('name') as string;

        if (currentPage === 'sign-in') {
            try {
                const res = await signIn({ email, password }).unwrap();
                if (res.access_token) {
                    dispatch(setCredentials({ user: res, token: res.access_token }));
                    toast({ title: 'Welcome back!' });
                    router.replace('/');
                }
            } catch (err: any) {
                toast({
                    variant: 'destructive',
                    title: 'Login failed',
                    description: err?.data?.message || 'Invalid credentials',
                });
            }
        } else if (currentPage === 'sign-up') {
            try {
                const res = await signUp({ email, password, name }).unwrap();
                if (res.user_id) {
                    setUserId(res.user_id);
                    setCurrentPage('otp');
                    toast({ title: 'Check your email for the OTP!' });
                }
            } catch (err: any) {
                toast({
                    variant: 'destructive',
                    title: 'Registration failed',
                    description: err?.data?.message || 'Error creating account',
                });
            }
        }
    }

    const togglePage = () => {
        if (currentPage === 'otp') {
            setCurrentPage('sign-up');
            return;
        }
        setCurrentPage((p) => (p === 'sign-in' ? 'sign-up' : 'sign-in'));
    };

    return (
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <Button
                onClick={togglePage}
                variant={'ghost'}
                className={'absolute right-4 top-4 md:right-8 md:top-8'}
            >
                {currentPage === 'sign-in' ? 'Register' : currentPage === 'otp' ? 'Back' : 'Login'}
            </Button>
            <div className="flex flex-col space-y-2 text-start">
                <h1 className="text-2xl font-semibold tracking-tight text-primary">
                    {currentPage === 'sign-in' ? 'Sign in' : currentPage === 'otp' ? 'Verify OTP' : 'Sign up'}
                </h1>
                <p className="text-sm text-muted-foreground">
                    {currentPage === 'sign-in'
                        ? 'Enter your details to sign in to your account'
                        : currentPage === 'otp'
                        ? 'Enter the 6-digit code sent to your email'
                        : 'Enter your details to create your account'}
                </p>
            </div>
            <div className={cn('grid gap-6', className)} {...props}>
                <form action={onSubmit}>
                    <div className="grid gap-4">
                        {currentPage === 'otp' ? (
                            <div className="grid gap-1">
                                <Label className="sr-only" htmlFor="otp">
                                    OTP
                                </Label>
                                <Input
                                    id="otp"
                                    name="otp"
                                    placeholder="123456"
                                    type="text"
                                    maxLength={6}
                                    autoComplete="one-time-code"
                                    disabled={isLoading}
                                    className="text-center tracking-widest text-lg"
                                />
                            </div>
                        ) : (
                            <>
                                <div
                                    className={cn(
                                        currentPage === 'sign-in' ? 'hidden' : 'grid',
                                        'gap-1'
                                    )}
                                >
                                    <Label className="sr-only" htmlFor="name">
                                        Name
                                    </Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        placeholder="eg. Jerin"
                                        type="text"
                                        autoCapitalize="words"
                                        autoComplete="name"
                                        autoCorrect="off"
                                        disabled={isLoading}
                                    />
                                </div>
                                <div className="grid gap-1">
                                    <Label className="sr-only" htmlFor="email">
                                        Email
                                    </Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        placeholder="name@example.com"
                                        type="email"
                                        autoCapitalize="none"
                                        autoComplete="email"
                                        autoCorrect="off"
                                        disabled={isLoading}
                                    />
                                </div>
                                <div className="grid gap-1">
                                    <Label className="sr-only" htmlFor="password">
                                        Password
                                    </Label>
                                    <Input
                                        id="password"
                                        name="password"
                                        placeholder="password"
                                        type="password"
                                        autoCapitalize="none"
                                        autoComplete="current-password"
                                        autoCorrect="off"
                                        disabled={isLoading}
                                    />
                                </div>
                            </>
                        )}
                        <Button disabled={isLoading} className="bg-primary hover:bg-primary/90">
                            {isLoading && (
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            {currentPage === 'sign-in' ? 'Sign in' : currentPage === 'otp' ? 'Verify' : 'Sign up'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
