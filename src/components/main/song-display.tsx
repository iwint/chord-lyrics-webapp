'use client';

import {
    CheckIcon,
    Edit,
    HeartIcon,
    LogIn,
    LogOut,
    Trash2,
    X,
    Loader2,
} from 'lucide-react';
import { useState } from 'react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import useAddSongModal from '@/hooks/use-add-modal';
import useDeleteModal from '@/hooks/use-delete-modal';
import { useSongs } from '@/store/useSongs';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { useToast } from '../ui/use-toast';
import { EmptyPlaceholder } from './empty-placeholder';
import { ChordLyricsRenderer } from '../ai/ChordLyricsRenderer';

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

interface SongDisplayProps {
    song: any | null;
}

interface InfoBadgeProps {
    label: string;
    value?: string;
}

function InfoBadge({ label, value }: InfoBadgeProps) {
    const display =
        value && value !== 'N/A' && value.trim() !== '' ? value : 'N/A';
    return (
        <div className="flex items-center gap-1.5 bg-background/80 backdrop-blur-sm rounded-md px-2.5 py-1 border border-border/50 shadow-sm transition-colors hover:border-primary/30">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/80">
                {label}
            </span>
            <span className="text-[11px] font-bold text-foreground/90">
                {display}
            </span>
        </div>
    );
}

export function SongDisplay({ song }: SongDisplayProps) {
    const router = useRouter();
    const { toast } = useToast();
    const { onOpen, setData, setEdit } = useAddSongModal();
    const [tabs] = useSongs();
    const { onOpen: openDeleteModal } = useDeleteModal();
    const dispatch = useDispatch();
    const [showChords, setShowChords] = useState(true);

    // Redux State & Hooks
    const { isAuthenticated, user, isAdmin } = useSelector(
        (state: RootState) => state.auth
    );
    const { data: pinsRes } = useGetPinnedSongsQuery(undefined, {
        skip: !isAuthenticated,
    });
    const [pinSong, { isLoading: isPinning }] = usePinSongMutation();
    const [unpinSong, { isLoading: isUnpinning }] = useUnpinSongMutation();
    const [approveSong, { isLoading: isApproving }] = useApproveSongMutation();
    const [rejectSong, { isLoading: isRejecting }] = useRejectSongMutation();

    const isSongPinned = (songId: string) => {
        if (!isAuthenticated || !pinsRes?.data) return false;
        return pinsRes.data.some(
            (pinnedSong: any) => pinnedSong.song_id === songId
        );
    };

    const handleLogout = () => {
        dispatch(logout());
        router.refresh();
    };

    const handleTogglePin = async () => {
        if (!isAuthenticated || !song) {
            toast({
                title: 'Please sign in to pin songs',
                variant: 'destructive',
            });
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
            toast({
                title: 'Failed to update favourites',
                variant: 'destructive',
            });
        }
    };

    const handleLogin = () => {
        router.push('/sign-in');
    };

    const handleEditModal = () => {
        if (!song) return;
        try {
            const parsedLyrics = song.lyrics.startsWith('"')
                ? JSON.parse(song.lyrics)
                : song.lyrics;
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
                                    disabled={
                                        !song ||
                                        !isAuthenticated ||
                                        isPinning ||
                                        isUnpinning
                                    }
                                    className="hover:bg-accent hover:text-accent-foreground transition-colors"
                                >
                                    {isPinning || isUnpinning ? (
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    ) : isSongPinned(song?.song_id) ? (
                                        <HeartIcon
                                            fill="currentColor"
                                            className="h-5 w-5 text-destructive"
                                        />
                                    ) : (
                                        <HeartIcon className="h-5 w-5" />
                                    )}
                                    <span className="sr-only">
                                        Add to favourites
                                    </span>
                                </Button>
                            </TooltipTrigger>
                        )}
                        <TooltipContent>Add to favourites</TooltipContent>
                    </Tooltip>

                    {(isAdmin || user?.user_id === song?.user_id) && song && (
                        <>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        onClick={handleEditModal}
                                        variant="ghost"
                                        size="icon"
                                    >
                                        <Edit className="h-5 w-5" />
                                        <span className="sr-only">Edit</span>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Edit</TooltipContent>
                            </Tooltip>

                            {isAdmin &&
                                tabs.currentTab.value === 'requests' && (
                                    <>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    onClick={handleApprove}
                                                    variant="ghost"
                                                    size="icon"
                                                    disabled={
                                                        isApproving ||
                                                        isRejecting
                                                    }
                                                >
                                                    {isApproving ? (
                                                        <Loader2 className="h-5 w-5 text-emerald-500 animate-spin" />
                                                    ) : (
                                                        <CheckIcon className="text-emerald-500 h-5 w-5" />
                                                    )}
                                                    <span className="sr-only">
                                                        Approve
                                                    </span>
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                Approve
                                            </TooltipContent>
                                        </Tooltip>

                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    onClick={handleReject}
                                                    variant="ghost"
                                                    size="icon"
                                                    disabled={
                                                        isApproving ||
                                                        isRejecting
                                                    }
                                                >
                                                    {isRejecting ? (
                                                        <Loader2 className="h-5 w-5 text-destructive animate-spin" />
                                                    ) : (
                                                        <X
                                                            className="h-5 w-5 text-destructive"
                                                            strokeWidth={2}
                                                        />
                                                    )}
                                                    <span className="sr-only">
                                                        Decline
                                                    </span>
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                Decline
                                            </TooltipContent>
                                        </Tooltip>
                                    </>
                                )}

                            {(!isAdmin ||
                                tabs.currentTab.value !== 'requests') && (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            onClick={handleDeleteModal}
                                            variant="ghost"
                                            size="icon"
                                        >
                                            <Trash2
                                                strokeWidth={2}
                                                className="h-5 w-5 text-destructive"
                                            />
                                            <span className="sr-only">
                                                Delete
                                            </span>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Delete</TooltipContent>
                                </Tooltip>
                            )}
                        </>
                    )}
                </div>

                <div className="ml-auto flex items-center gap-4">
                    {song && (
                        <div className="flex items-center space-x-2 select-none mr-2">
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
                    )}

                    <Tooltip>
                        <TooltipTrigger asChild>
                            {isAuthenticated ? (
                                <Button
                                    onClick={handleLogout}
                                    variant="destructive"
                                    size="icon"
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span className="sr-only">Log out</span>
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleLogin}
                                    variant="default"
                                    size="icon"
                                    className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20"
                                >
                                    <LogIn className="h-4 w-4" />
                                    <span className="sr-only">Log in</span>
                                </Button>
                            )}
                        </TooltipTrigger>
                        <TooltipContent>
                            {isAuthenticated ? 'Log out' : 'Log in'}
                        </TooltipContent>
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
                                        {format(
                                            new Date(song.created_at),
                                            'PPP'
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-wrap items-center gap-2 mt-2">
                                <InfoBadge label="Key" value={song.scale} />
                                <InfoBadge label="Time" value={song.beat} />
                                <InfoBadge label="Tempo" value={song.tempo} />
                                <InfoBadge label="Genre" value={song.style} />
                                <InfoBadge label="Lang" value={song.language} />
                                <InfoBadge
                                    label="Inst"
                                    value={song.keyboard_modal}
                                />
                            </div>
                        </div>
                    </div>

                    <ScrollArea className="flex-1 p-6 text-base md:text-lg">
                        <div className="mx-auto w-fit pb-20">
                            <ChordLyricsRenderer
                                fontSize={18}
                                showChords={showChords}
                                content={
                                    song.lyrics?.startsWith('"')
                                        ? JSON.parse(song.lyrics)
                                        : song.lyrics || ''
                                }
                            />
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
