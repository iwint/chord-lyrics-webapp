'use client';

import { Icons } from '@/assets/icons/spinner-icon';
import { cn } from '@/lib/utils';

import { useRouter } from 'next/navigation';
import * as React from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const router = useRouter();

    async function onSubmit(event: React.SyntheticEvent) {
        event.preventDefault();
        setIsLoading(true);

        setTimeout(() => {
            setIsLoading(false);
            router.push('/main');
        }, 3000);
    }

    return (
        <div className={cn('grid gap-6', className)} {...props}>
            <form onSubmit={onSubmit}>
                <div className="grid gap-4">
                    <div className="grid gap-1">
                        <Label className="sr-only" htmlFor="email">
                            Email
                        </Label>
                        <Input
                            id="email"
                            placeholder="name@example.com"
                            type="email"
                            autoCapitalize="none"
                            autoComplete="email"
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
                            placeholder="name@password"
                            type="password"
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect="off"
                            disabled={isLoading}
                        />
                    </div>
                    <Button disabled={isLoading}>
                        {isLoading && (
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Sign in
                    </Button>
                </div>
            </form>
        </div>
    );
}
