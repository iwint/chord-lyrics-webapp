'use client';

import {
    CheckIcon,
    Edit,
    HeartIcon,
    LogIn,
    LogOut,
    Trash2,
    X,
} from 'lucide-react';
import React from 'react';
import { format } from 'date-fns';
import useAddSongModal from '@/hooks/use-add-modal';
import useDeleteModal from '@/hooks/use-delete-modal';
import { useSongs } from '@/store/useSongs';
import { useRouter } from 'next/navigation';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { useToast } from '../ui/use-toast';
import { EmptyPlaceholder } from './empty-placeholder';

// Redux
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store/store';
import { logout } from '@/lib/store/slices/authSlice';
import {
    useApproveSongMutation,
    useRejectSongMutation,
} from '@/lib/store/api/songsApi';
import {
    useGetPinnedSongsQuery,
    usePinSongMutation,
    useUnpinSongMutation,
} from '@/lib/store/api/pinsApi';
import { cn } from '@/lib/utils';

interface SongDisplayProps {
    song: any | null;
}

// Helper to format lyrics with chords
const formatLyrics = (rawLyrics: string) => {
    try {
        let text = rawLyrics;
        if (rawLyrics.startsWith('"') && rawLyrics.endsWith('"')) {
             text = JSON.parse(rawLyrics);
        }
        
        // Split by lines and render
        return text.split('\n').map((line: string, i: number) => {
            // Replace [Chord] with styled span
            const formattedLine = line.split(/(\[[^\]]+\])/g).map((part, j) => {
                if (part.startsWith('[') && part.endsWith(']')) {
                    return (
                        <span key={j} className="chord-marker">
                            {part.replace(/[\[\]]/g, '')}
                        </span>
                    );
                }
                return part;
            });
            
            return (
                <div key={i} className="min-h-[1.5rem] leading-8 font-medium">
                    {formattedLine}
                </div>
            );
        });
    } catch (e) {
        return rawLyrics;
    }
};

export function SongDisplay({ song }: SongDisplayProps) {
    const router = useRouter();
    const { toast } = useToast();
    const { onOpen, setData, setEdit } = useAddSongModal();
    const [tabs] = useSongs();
    const { onOpen: openDeleteModal } = useDeleteModal();
    const dispatch = useDispatch();

    // Redux State & Hooks
    const { isAuthenticated, user, isAdmin } = useSelector((state: RootState) => state.auth);
    const { data: pinsRes } = useGetPinnedSongsQuery(undefined, { skip: !isAuthenticated });
    const [pinSong] = usePinSongMutation();
    const [unpinSong] = useUnpinSongMutation();
    const [approveSong] = useApproveSongMutation();
    const [rejectSong] = useRejectSongMutation();

    const isSongPinned = (songId: string) => {
        if (!isAuthenticated || !pinsRes?.data) return false;
        return pinsRes.data.some((pinnedSong: any) => pinnedSong.song_id === songId);
    };

    const handleLogout = () => {
        dispatch(logout());
        router.refresh();
    };

    const handleTogglePin = async () => {
        if (!isAuthenticated || !song) {
            toast({ title: 'Please sign in to pin songs', variant: 'destructive' });
            return;
        }

        try {
            const currentlyPinned = isSongPinned(song.song_id);
            if (currentlyPinned) {
                await unpinSong(song.song_id).unwrap();
                toast({ title: 'Removed from favourites' });
            } else {
                await pinSong(song.song_id).unwrap();
                toast({ title: 'Added to favourites' });
            }
        } catch (error) {
            toast({ title: 'Failed to update favourites', variant: 'destructive' });
        }
    };

    const handleLogin = () => {
        router.push('/login');
    };

    const handleEditModal = () => {
        if (!song) return;
        try {
            const parsedLyrics = song.lyrics.startsWith('"') ? JSON.parse(song.lyrics) : song.lyrics;
            setData({
                ...song,
                lyrics: parsedLyrics,
            });
        } catch {
            setData({ ...song });
        }
        setEdit(true);
        onOpen();
    };

    const handleDeleteModal = () => {
        openDeleteModal();
    };

    const handleApprove = async () => {
        try {
            await approveSong(song.song_id).unwrap();
            toast({ title: 'Song approved successfully' });
        } catch (error) {
            toast({ title: 'Failed to approve song', variant: 'destructive' });
        }
    };

    const handleReject = async () => {
        try {
            await rejectSong(song.song_id).unwrap();
            toast({ title: 'Song rejected' });
        } catch (error) {
            toast({ title: 'Failed to reject song', variant: 'destructive' });
        }
    };

    return (
        <div className="flex h-full flex-col bg-card/40">
            <div className="flex items-center p-2 backdrop-blur-sm sticky top-0 z-10 border-b border-border/50">
                <div className="flex items-center gap-2">
                    <Tooltip>
                        {tabs.currentTab.value !== 'my-songs' && (
                            <TooltipTrigger asChild>
                                <Button
                                    onClick={handleTogglePin}
                                    variant="ghost"
                                    size="icon"
                                    disabled={!song || !isAuthenticated}
                                    className="hover:bg-accent hover:text-accent-foreground transition-colors"
                                >
                                    {isSongPinned(song?.song_id) ? (
                                        <HeartIcon
                                            fill="currentColor"
                                            className="h-5 w-5 text-destructive"
                                        />
                                    ) : (
                                        <HeartIcon className="h-5 w-5" />
                                    )}
                                    <span className="sr-only">Add to favourites</span>
                                </Button>
                            </TooltipTrigger>
                        )}
                        <TooltipContent>Add to favourites</TooltipContent>
                    </Tooltip>
                    
                    {(isAdmin || user?.user_id === song?.user_id) && song && (
                        <>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button onClick={handleEditModal} variant="ghost" size="icon">
                                        <Edit className="h-5 w-5" />
                                        <span className="sr-only">Edit</span>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Edit</TooltipContent>
                            </Tooltip>
                            
                            {isAdmin && tabs.currentTab.value === 'requests' && (
                                <>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button onClick={handleApprove} variant="ghost" size="icon">
                                                <CheckIcon className="text-emerald-500 h-5 w-5" />
                                                <span className="sr-only">Approve</span>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Approve</TooltipContent>
                                    </Tooltip>
                                    
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button onClick={handleReject} variant="ghost" size="icon">
                                                <X className="h-5 w-5 text-destructive" strokeWidth={2} />
                                                <span className="sr-only">Decline</span>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Decline</TooltipContent>
                                    </Tooltip>
                                </>
                            )}
                            
                            {(!isAdmin || tabs.currentTab.value !== 'requests') && (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button onClick={handleDeleteModal} variant="ghost" size="icon">
                                            <Trash2 strokeWidth={2} className="h-5 w-5 text-destructive" />
                                            <span className="sr-only">Delete</span>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Delete</TooltipContent>
                                </Tooltip>
                            )}
                        </>
                    )}
                </div>
                
                <div className="ml-auto flex items-center gap-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            {isAuthenticated ? (
                                <Button onClick={handleLogout} variant="destructive" size="icon">
                                    <LogOut className="h-4 w-4" />
                                    <span className="sr-only">Log out</span>
                                </Button>
                            ) : (
                                <Button onClick={handleLogin} variant="default" size="icon" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20">
                                    <LogIn className="h-4 w-4" />
                                    <span className="sr-only">Log in</span>
                                </Button>
                            )}
                        </TooltipTrigger>
                        <TooltipContent>{isAuthenticated ? 'Log out' : 'Log in'}</TooltipContent>
                    </Tooltip>
                </div>
            </div>

            {song ? (
                <div className="flex h-full flex-col overflow-hidden">
                    <div className="flex items-start p-6 bg-gradient-to-b from-primary/5 to-transparent border-b border-border/30 shadow-sm">
                        <div className="flex flex-col gap-3 w-full">
                            <div className="flex justify-between items-start w-full">
                                <h2 className="text-3xl font-extrabold tracking-tight text-foreground/90">
                                    {song.title}
                                </h2>
                                {song.created_at && (
                                    <div className="text-xs text-muted-foreground whitespace-nowrap bg-muted px-2 py-1 rounded-md border border-border/50">
                                        {format(new Date(song.created_at), 'PPP')}
                                    </div>
                                )}
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                                <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 text-xs py-1">
                                    Scale: {song.scale}
                                </Badge>
                                <Badge variant="outline" className="border-border/60 text-xs py-1">
                                    {song.language}
                                </Badge>
                                <Badge variant="outline" className="border-border/60 text-xs py-1">
                                    Beat: {song.beat}
                                </Badge>
                                <Badge variant="outline" className="border-border/60 text-xs py-1">
                                    Tempo: {song.tempo}
                                </Badge>
                                <Badge variant="outline" className="border-border/60 text-xs py-1">
                                    {song.style}
                                </Badge>
                            </div>
                        </div>
                    </div>
                    
                    <ScrollArea className="flex-1 p-6 text-base md:text-lg">
                        <div className="max-w-3xl mx-auto pb-20">
                            {formatLyrics(song.lyrics)}
                        </div>
                    </ScrollArea>
                </div>
            ) : (
                <EmptyPlaceholder
                    title="No song selected"
                    description="Please select a song from the list to display"
                />
            )}
        </div>
    );
}
