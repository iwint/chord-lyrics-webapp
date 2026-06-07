'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Mic, MicOff, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSearchLyricsMutation, useGetChatHistoryQuery } from '@/lib/store/api/aiChatApi';
import { useToast } from '@/components/ui/use-toast';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

export function AiChatDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  const { data: historyRes, refetch } = useGetChatHistoryQuery(undefined, { skip: !isAuthenticated || !open });
  const [searchLyrics, { isLoading }] = useSearchLyricsMutation();
  
  const messages = historyRes?.data || [];

  useEffect(() => {
    if (open) refetch();
  }, [open, refetch]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    setInput('');
    
    try {
      await searchLyrics({ query: text }).unwrap();
    } catch (err) {
      toast({ title: 'AI failed to respond', variant: 'destructive' });
    }
  };

  // Web Speech API for Voice Input
  const toggleListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({ title: 'Voice input not supported in your browser', variant: 'destructive' });
      return;
    }

    if (isListening) {
      setIsListening(false);
      return; // The recognition stop will be handled if we stored the instance
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput((prev) => prev + (prev ? ' ' : '') + transcript);
      setIsListening(false);
    };
    
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    
    recognition.start();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col p-0 gap-0 overflow-hidden glass-card">
        <DialogHeader className="p-4 border-b border-border/50 bg-primary/5 flex flex-row items-center justify-between">
          <DialogTitle className="flex items-center gap-2">
            <div className="bg-primary/20 p-2 rounded-full">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            AI Lyrics Assistant
          </DialogTitle>
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="h-8 w-8 rounded-full">
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <ScrollArea className="flex-1 p-4 bg-background/40" ref={scrollRef as any}>
          <div className="flex flex-col gap-4">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground mt-20 flex flex-col items-center gap-2">
                <Bot className="h-10 w-10 text-muted-foreground/30" />
                <p>Hello! Ask me to find lyrics and chords for any song.</p>
                <p className="text-xs">Example: &quot;What are the chords for Perfect by Ed Sheeran?&quot;</p>
              </div>
            )}
            
            {messages.map((msg: any) => (
              <div key={msg.chat_id} className={cn("flex flex-col max-w-[85%]", msg.role === 'user' ? "self-end items-end" : "self-start items-start")}>
                <div className={cn(
                  "p-3 rounded-2xl shadow-sm text-sm",
                  msg.role === 'user' 
                    ? "bg-primary text-primary-foreground rounded-tr-sm" 
                    : "bg-card border border-border/50 rounded-tl-sm prose dark:prose-invert prose-sm"
                )}>
                  {msg.role === 'user' ? (
                    msg.message
                  ) : (
                    <ReactMarkdown>{msg.message}</ReactMarkdown>
                  )}
                </div>
                <span className="text-[10px] text-muted-foreground mt-1 px-1">
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
            
            {isLoading && (
              <div className="self-start bg-card border border-border/50 p-3 rounded-2xl rounded-tl-sm flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">Thinking...</span>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-3 bg-background/80 backdrop-blur-sm border-t border-border/50 flex items-center gap-2">
          <Button
            variant={isListening ? "destructive" : "secondary"}
            size="icon"
            onClick={toggleListening}
            className={cn("shrink-0 transition-colors rounded-full", isListening && "animate-pulse")}
            type="button"
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4 text-primary" />}
          </Button>
          
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend(input);
              }
            }}
            placeholder="Ask AI for chords or lyrics..."
            className="flex-1 bg-card/50 border-border/50 focus-visible:ring-primary rounded-full px-4"
          />
          
          <Button
            onClick={() => handleSend(input)}
            disabled={!input.trim() || isLoading}
            size="icon"
            className="shrink-0 rounded-full bg-primary hover:bg-primary/90 shadow-sm"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
