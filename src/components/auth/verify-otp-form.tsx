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
import { useVerifyOtpMutation } from '@/lib/store/api/authApi';
import Link from 'next/link';
import Cookies from 'js-cookie';

interface VerifyOtpFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function VerifyOtpForm({ className, ...props }: VerifyOtpFormProps) {
    const router = useRouter();
    const [userId, setUserId] = React.useState<string | null>(null);
    const { toast } = useToast();
    const dispatch = useDispatch();

    const [verifyOtp, { isLoading }] = useVerifyOtpMutation();

    React.useEffect(() => {
        const id = Cookies.get('pending_user_id');
        if (!id) {
            toast({
                variant: 'destructive',
                title: 'Missing User ID',
                description: 'Please sign up first to get an OTP.',
            });
            router.replace('/sign-up');
        } else {
            setUserId(id);
        }
    }, [router, toast]);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const otp = formData.get('otp') as string;
        if (!userId || !otp) return;

        try {
            const res = await verifyOtp({ user_id: userId, otp }).unwrap();
            const accessToken = res?.data?.access_token;
            if (accessToken) {
                Cookies.remove('pending_user_id');
                dispatch(
                    setCredentials({
                        user: res?.data,
                        token: accessToken,
                    })
                );
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
    }

    if (!userId) return null;

    return (
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <Button
                asChild
                variant={'ghost'}
                className={'absolute right-4 top-4 md:right-8 md:top-8'}
            >
                <Link href="/sign-up">Back</Link>
            </Button>
            <div className="flex flex-col space-y-2 text-start">
                <h1 className="text-2xl font-semibold tracking-tight text-primary">
                    Verify OTP
                </h1>
                <p className="text-sm text-muted-foreground">
                    Enter the 6-digit code sent to your email
                </p>
            </div>
            <div className={cn('grid gap-6', className)} {...props}>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4">
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
                                required
                                className="text-center tracking-widest text-lg"
                            />
                        </div>
                        <Button
                            disabled={isLoading}
                            className="bg-primary hover:bg-primary/90"
                        >
                            {isLoading ? (
                                <>
                                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                                    Verifying...
                                </>
                            ) : (
                                'Verify'
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
