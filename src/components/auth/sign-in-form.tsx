'use client';

import { Icons } from '@/assets/icons/spinner-icon';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useToast } from '../ui/use-toast';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/lib/store/slices/authSlice';
import { useSignInMutation } from '@/lib/store/api/authApi';
import Link from 'next/link';

interface SignInFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SignInForm({ className, ...props }: SignInFormProps) {
    const router = useRouter();
    const { toast } = useToast();
    const dispatch = useDispatch();

    const [signIn, { isLoading }] = useSignInMutation();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        try {
            const res = await signIn({ email, password }).unwrap();
            const data = res?.data;
            if (data?.access_token) {
                dispatch(
                    setCredentials({
                        user: data,
                        token: data.access_token,
                    })
                );
                toast({ title: 'Welcome back!' });
                router.replace('/');
            }
        } catch (err: any) {
            toast({
                variant: 'destructive',
                title: 'Login failed',
                description: err?.message || 'Invalid credentials',
            });
        }
    }

    return (
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <Button
                asChild
                variant={'ghost'}
                className={'absolute right-4 top-4 md:right-8 md:top-8'}
            >
                <Link href="/sign-up">Register</Link>
            </Button>
            <div className="flex flex-col space-y-2 text-start">
                <h1 className="text-2xl font-semibold tracking-tight text-primary">
                    Sign in
                </h1>
                <p className="text-sm text-muted-foreground">
                    Enter your details to sign in to your account
                </p>
            </div>
            <div className={cn('grid gap-6', className)} {...props}>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4">
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
                                required
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
                                required
                            />
                        </div>
                        <Button
                            disabled={isLoading}
                            className="bg-primary hover:bg-primary/90"
                        >
                            {isLoading ? (
                                <>
                                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                'Sign in'
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
