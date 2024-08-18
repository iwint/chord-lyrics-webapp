'use client';

import { cn } from '@/lib/utils';
import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog';

interface ModalProps {
    open: boolean;
    title: string;
    description: string;
    className?: string;
    close: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
    children,
    description,
    title,
    open,
    close,
    className,
}) => {
    return (
        <Dialog modal onOpenChange={close} open={open}>
            <DialogContent
                className={cn(className ? className : 'w-[80%] h-[90%]')}
            >
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                {children}
            </DialogContent>
        </Dialog>
    );
};

export default Modal;
