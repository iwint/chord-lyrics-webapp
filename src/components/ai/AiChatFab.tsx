'use client';

import React, { useState } from 'react';
import { Bot, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AiChatDialog } from './AiChatDialog';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';

export function AiChatFab() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated) return null;

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-full blur opacity-50 group-hover:opacity-100 transition duration-500"></div>
          <Button
            onClick={() => setOpen(true)}
            size="icon"
            className="relative h-14 w-14 rounded-full shadow-2xl bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center border-2 border-background/50 hover:scale-105 transition-transform"
          >
            <Bot className="h-6 w-6" />
            <Sparkles className="absolute top-2 right-2 h-3 w-3 text-yellow-300 animate-pulse" />
          </Button>
        </div>
      </div>
      
      <AiChatDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
