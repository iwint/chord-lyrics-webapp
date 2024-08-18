'use client';

import { POST } from '@/api/api-config';
import { Icons } from '@/assets/icons/spinner-icon';
import { cn } from '@/lib/utils';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { trackPromise, usePromiseTracker } from 'react-promise-tracker';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useToast } from '../ui/use-toast';

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
    const [currentPage, setCurrentPage] = React.useState('sign-in');
    const { promiseInProgress } = usePromiseTracker();
    const router = useRouter();
    const { toast, toasts } = useToast();

    async function onSubmit(formData: FormData) {
        const payload = {
            email: formData.get('email'),
            password: formData.get('password'),
            name: formData.get('name'),
        };

        const endpoint =
            currentPage === 'sign-in' ? 'auth/login' : 'auth/register';

        const response = await trackPromise(POST(endpoint, payload));

        if (response.status === 'ok') {
            if (
                response.message === 'User not exist' ||
                response.message === 'User already exist'
            ) {
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: response.message,
                });
                togglePage();
            } else if (response.token) {
                await Cookies.set('token', response?.token);
                router.replace('/')
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: response.message,
                });
            }
        } else {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: response.message,
            });
        }
    }

    const togglePage = () => {
        setCurrentPage((p) => (p === 'sign-in' ? 'sign-up' : 'sign-in'));
    };

    return (
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <Button
                onClick={togglePage}
                variant={'ghost'}
                className={'absolute right-4 top-4 md:right-8 md:top-8'}
            >
                {currentPage === 'sign-in' ? 'Register' : 'Login'}
            </Button>
            <div className="flex flex-col space-y-2 text-start">
                <h1 className="text-2xl font-semibold tracking-tight">
                    {currentPage === 'sign-in' ? 'Sign in' : 'Sign up'}
                </h1>
                <p className="text-sm text-muted-foreground">
                    {currentPage === 'sign-in'
                        ? 'Enter your details to sign in to your account'
                        : 'Enter your details to create your account'}
                </p>
            </div>
            <div className={cn('grid gap-6', className)} {...props}>
                <form action={onSubmit}>
                    <div className="grid gap-4">
                        <div
                            className={cn(
                                currentPage === 'sign-in' ? 'hidden' : 'grid',
                                'gap-1'
                            )}
                        >
                            <Label className="sr-only" htmlFor="email">
                                Name
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="eg.Jerin"
                                type="text"
                                autoCapitalize="none"
                                autoComplete="name"
                                autoCorrect="off"
                                disabled={promiseInProgress}
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
                                disabled={promiseInProgress}
                            />
                        </div>
                        <div className="grid gap-1">
                            <Label className="sr-only" htmlFor="email">
                                Password
                            </Label>
                            <Input
                                id="password"
                                name="password"
                                placeholder="name@password"
                                type="password"
                                autoCapitalize="none"
                                autoComplete="email"
                                autoCorrect="off"
                                disabled={promiseInProgress}
                            />
                        </div>
                        <Button disabled={promiseInProgress}>
                            {promiseInProgress && (
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            {currentPage === 'sign-in' ? 'Sign in' : 'Sign up'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
