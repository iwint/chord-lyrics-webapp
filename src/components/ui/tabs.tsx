'use client';

import * as TabsPrimitive from '@radix-ui/react-tabs';
import * as React from 'react';

import { cn } from '@/lib/utils';
import { Separator } from './separator';

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.List>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
    <TabsPrimitive.List
        ref={ref}
        className={cn(
            'inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground',
            className
        )}
        {...props}
    />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
    <TabsPrimitive.Trigger
        ref={ref}
        className={cn(
            'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
            className
        )}
        {...props}
    />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

type ExtraContentProps = {
    title?: string;
    description?: string;
};

const TabsContent = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content> &
        ExtraContentProps
>(({ className, title, description, ...props }, ref) => (
    <TabsPrimitive.Content
        ref={ref}
        className={cn(
            'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            className
        )}
        {...props}
    >
        {title && (
            <>
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-semibold tracking-tight">
                            {title}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            {description}
                        </p>
                    </div>
                </div>
                <Separator className="my-4" />
            </>
        )}

        {props.children}
    </TabsPrimitive.Content>
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsContent, TabsList, TabsTrigger };
