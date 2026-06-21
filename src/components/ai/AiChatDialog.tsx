'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { Bot, Send, Mic, MicOff, Loader2, Save, Music2 } from 'lucide-react';
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
import useAddSongModal from '@/hooks/use-add-modal';
import { ChordLyricsRenderer } from './ChordLyricsRenderer';

// ── Song Info Header ─────────────────────────────────────────────────────────

interface InfoBadgeProps {
    label: string;
    value?: string;
}

function InfoBadge({ label, value }: InfoBadgeProps) {
    const display = value && value !== 'N/A' && value.trim() !== '' ? value : 'N/A';
    return (
        <div className="flex items-center gap-1.5 bg-background/80 backdrop-blur-sm rounded-md px-2.5 py-1 border border-border/50 shadow-sm transition-colors hover:border-primary/30">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/80">{label}</span>
            <span className="text-[11px] font-bold text-foreground/90">{display}</span>
        </div>
    );
}

function SongInfoHeader({ payload }: { payload: any }) {
    if (!payload) return null;
    return (
        <div className="bg-gradient-to-br from-primary/5 via-background to-background border-b border-border/40 px-5 py-4">
            <div className="flex items-center gap-2.5 mb-3">
                <div className="bg-primary/10 p-1.5 rounded-md text-primary shadow-sm">
                    <Music2 className="h-4 w-4" />
                </div>
                <span className="font-bold text-[15px] text-foreground tracking-tight">
                    {payload.title || 'Unknown Song'}
                </span>
            </div>
            <div className="flex flex-wrap gap-2">
                <InfoBadge label="Key" value={payload.scale} />
                <InfoBadge label="Time" value={payload.beat} />
                <InfoBadge label="Tempo" value={payload.tempo} />
                <InfoBadge label="Genre" value={payload.style} />
                <InfoBadge label="Lang" value={payload.language} />
                <InfoBadge label="Inst" value={payload.keyboard_modal} />
            </div>
        </div>
    );
}

// ── Main Dialog ──────────────────────────────────────────────────────────────

export function AiChatDialog({
    open,
    onOpenChange,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const [input, setInput] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [showChords, setShowChords] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();

    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const { data: historyRes, refetch } = useGetChatHistoryQuery(undefined, {
        skip: !isAuthenticated || !open,
    });
    const [searchLyrics, { isLoading }] = useSearchLyricsMutation();
    const { onOpen: openAddModal, setData: setAddModalData, setEdit } = useAddSongModal();

    const messages = useMemo(() => historyRes?.data || [], [historyRes]);

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
        } catch {
            toast({ title: 'AI failed to respond', variant: 'destructive' });
        }
    };

    const handleSaveAsSong = (msg: any) => {
        const p = msg.payload;
        setAddModalData(
            p
                ? {
                      title: p.title,
                      scale: p.scale,
                      beat: p.beat,
                      tempo: p.tempo,
                      style: p.style,
                      language: p.language,
                      keyboard_modal: p.keyboard_modal,
                      lyrics: p.lyrics,
                  }
                : ({ lyrics: msg.content } as any),
        );
        setEdit(false);
        openAddModal();
        onOpenChange(false);
    };

    const toggleListening = () => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            toast({ title: 'Voice input not supported in your browser', variant: 'destructive' });
            return;
        }
        if (isListening) { setIsListening(false); return; }

        const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SR();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.onstart = () => setIsListening(true);
        recognition.onresult = (e: any) => {
            setInput((prev) => prev + (prev ? ' ' : '') + e.results[0][0].transcript);
            setIsListening(false);
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
        recognition.start();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[560px] h-[680px] flex flex-col p-0 gap-0 overflow-hidden glass-card">
                {/* ── Header ── */}
                <DialogHeader className="p-4 border-b border-border/40 bg-gradient-to-r from-primary/10 via-background to-background flex flex-row items-center justify-between shrink-0 shadow-sm z-10">
                    <DialogTitle className="flex items-center gap-3">
                        <div className="bg-primary p-2 rounded-xl shadow-md text-primary-foreground">
                            <Bot className="h-5 w-5" />
                        </div>
                        <span className="font-bold text-lg tracking-tight">AI Lyrics Assistant</span>
                    </DialogTitle>

                    {/* Chords Toggle */}
                    <div className="flex items-center space-x-2 mr-6 select-none">
                        <button
                            role="switch"
                            aria-checked={showChords}
                            onClick={() => setShowChords(!showChords)}
                            className={cn(
                                "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                                showChords ? "bg-primary" : "bg-input"
                            )}
                        >
                            <span
                                className={cn(
                                    "pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform duration-200",
                                    showChords ? "translate-x-4" : "translate-x-0"
                                )}
                            />
                        </button>
                        <span onClick={() => setShowChords(!showChords)} className="cursor-pointer text-xs font-semibold text-muted-foreground">
                            Chords
                        </span>
                    </div>
                </DialogHeader>

                {/* ── Chat Area ── */}
                <ScrollArea className="flex-1 bg-background/40" ref={scrollRef as any}>
                    <div className="flex flex-col gap-4 p-5">
                        {/* Empty state */}
                        {messages.length === 0 && (
                            <div className="text-center text-muted-foreground mt-20 flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-500">
                                <div className="bg-primary/5 p-6 rounded-full shadow-inner border border-primary/10">
                                    <Bot className="h-12 w-12 text-primary/40" />
                                </div>
                                <div className="space-y-1">
                                    <p className="font-semibold text-foreground/80 text-lg tracking-tight">Ask me for any song&apos;s chords.</p>
                                    <p className="text-sm opacity-70">e.g. &quot;Chords for Perfect by Ed Sheeran&quot;</p>
                                </div>
                            </div>
                        )}

                        {messages.map((msg: any, index: number) => (
                            <div
                                key={index}
                                className={cn(
                                    'flex flex-col',
                                    msg.role === 'user' ? 'items-end' : 'items-start'
                                )}
                            >
                                {msg.role === 'user' ? (
                                    // User bubble
                                    <div className="max-w-[80%] bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-3 text-[15px] shadow-md leading-relaxed">
                                        {msg.content}
                                    </div>
                                ) : (
                                    // AI bubble
                                    <div className="w-full bg-card border border-border/40 rounded-2xl rounded-tl-sm shadow-md overflow-hidden transition-all hover:shadow-lg">
                                        {/* Song info header — always shown, N/A for missing fields */}
                                        <SongInfoHeader payload={msg.payload} />

                                        {/* Chord lyrics — same column layout as mobile */}
                                        <div className="px-5 py-4 bg-background/50">
                                            <ChordLyricsRenderer content={msg.content} showChords={showChords} />
                                        </div>

                                        {/* Save button */}
                                        <div className="flex justify-end px-4 pb-4 pt-2 bg-background/50 border-t border-border/30">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-8 text-xs font-bold gap-2 text-primary border-primary/20 hover:bg-primary hover:text-primary-foreground transition-all shadow-sm rounded-full px-4"
                                                onClick={() => handleSaveAsSong(msg)}
                                            >
                                                <Save className="h-3.5 w-3.5" />
                                                Save as Song
                                            </Button>
                                        </div>
                                    </div>
                                )}
                                <span className="text-[10px] text-muted-foreground mt-1 px-1">
                                    {msg.created_at
                                        ? new Date(msg.created_at).toLocaleTimeString([], {
                                              hour: '2-digit',
                                              minute: '2-digit',
                                          })
                                        : ''}
                                </span>
                            </div>
                        ))}

                        {/* Loading indicator */}
                        {isLoading && (
                            <div className="self-start bg-card border border-border/40 px-5 py-3.5 rounded-2xl rounded-tl-sm flex items-center gap-3 shadow-md animate-in fade-in slide-in-from-bottom-2">
                                <div className="bg-primary/10 p-1.5 rounded-full">
                                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                </div>
                                <span className="text-[14px] font-medium text-muted-foreground tracking-tight">Generating chords...</span>
                            </div>
                        )}
                    </div>
                </ScrollArea>

                {/* ── Input Area ── */}
                <div className="p-4 bg-background/80 backdrop-blur-md border-t border-border/40 flex items-center gap-3 shrink-0 shadow-[0_-4px_15px_-3px_rgba(0,0,0,0.05)] z-10">
                    <Button
                        variant={isListening ? 'destructive' : 'outline'}
                        size="icon"
                        onClick={toggleListening}
                        className={cn('shrink-0 rounded-full h-11 w-11 transition-all', isListening ? 'animate-pulse shadow-lg shadow-destructive/30' : 'hover:bg-primary/5')}
                        type="button"
                    >
                        {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5 text-primary" />}
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
                        className="flex-1 bg-muted/50 border-transparent hover:border-border focus-visible:ring-1 focus-visible:ring-primary rounded-full px-5 h-11 text-[15px] shadow-inner transition-all"
                    />

                    <Button
                        onClick={() => handleSend(input)}
                        disabled={!input.trim() || isLoading}
                        size="icon"
                        className="shrink-0 rounded-full h-11 w-11 bg-gradient-to-br from-primary to-primary/90 hover:opacity-90 shadow-md transition-all disabled:opacity-50"
                    >
                        <Send className="h-5 w-5 ml-0.5" />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
