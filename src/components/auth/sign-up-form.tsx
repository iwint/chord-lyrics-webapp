'use client';

import { Icons } from '@/assets/icons/spinner-icon';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useToast } from '../ui/use-toast';
import { useSignUpMutation } from '@/lib/store/api/authApi';
import Link from 'next/link';
import Cookies from 'js-cookie';

interface SignUpFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SignUpForm({ className, ...props }: SignUpFormProps) {
    const router = useRouter();
    const { toast } = useToast();

    const [signUp, { isLoading }] = useSignUpMutation();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const name = formData.get('name') as string;

        try {
            const res = await signUp({ email, password, name }).unwrap();
            const userId = res?.data?.user_id || res?.user_id;
            if (userId) {
                Cookies.set('pending_user_id', userId, {
                    expires: 1 / 24,
                }); // expires in 1 hour
                toast({
                    title: res?.message || 'Check your email for the OTP!',
                });
                router.push(`/verify-otp`);
            }
        } catch (err: any) {
            toast({
                variant: 'destructive',
                title: 'Registration failed',
                description: err?.data?.message || 'Error creating account',
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
                <Link href="/sign-in">Login</Link>
            </Button>
            <div className="flex flex-col space-y-2 text-start">
                <h1 className="text-2xl font-semibold tracking-tight text-primary">
                    Sign up
                </h1>
                <p className="text-sm text-muted-foreground">
                    Enter your details to create your account
                </p>
            </div>
            <div className={cn('grid gap-6', className)} {...props}>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4">
                        <div className="grid gap-1">
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
                                required
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
                                autoComplete="new-password"
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
                                    Signing up...
                                </>
                            ) : (
                                'Sign up'
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
