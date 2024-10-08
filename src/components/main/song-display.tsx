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

import { format } from 'date-fns';

import { addToFavourites, approveSong, getAllSongs } from '@/api/api-services';
import useAddSongModal from '@/hooks/use-add-modal';
import useDeleteModal from '@/hooks/use-delete-modal';
import { SongSchema } from '@/models/song';
import { useSongs } from '@/store/useSongs';
import {
    addToFavouritesToLocalStorage,
    isSongPinned,
} from '@/utils/save-to-local';
import { useQueryClient } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { useToast } from '../ui/use-toast';
import { EmptyPlaceholder } from './empty-placeholder';

interface SongDisplayProps {
    song: SongSchema | null;
}

export function SongDisplay({ song }: SongDisplayProps) {
    const router = useRouter();
    const token = Cookies.get('token');
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const locallyStoredPinnedSongs = Cookies.get('pinnedSongs');
    const { onOpen, setData, setEdit } = useAddSongModal();
    const [tabs] = useSongs();
    const { onOpen: openDeleteModal } = useDeleteModal();
    const userId = Cookies.get('userId');
    const isAdmin = Cookies.get('isAdmin') === 'true';

    const handleLogout = () => {
        Cookies.remove('token');
        Cookies.remove('userId');
        Cookies.remove('isAdmin');
        router.refresh();
    };

    const handleAddToFavourites = async () => {
        let payload = {
            isPinned: !song?.isPinned,
        };
        if (token) {
            await addToFavourites(song?._id as string, payload).then(() =>
                getAllSongs()
            );
        } else {
            await addToFavouritesToLocalStorage({
                _id: song?._id,
                isPinned: !song?.isPinned,
            });
        }

        toast({
            title: payload.isPinned
                ? 'Added to favourites'
                : 'Removed from favourites',
        });
        await queryClient.invalidateQueries({
            queryKey: ['songs'],
        });
    };

    const handleLogin = () => {
        router.push('/login');
    };

    const handleEditModal = () => {
        setData({
            ...(song as SongSchema),
            lyrics: JSON.parse(song?.lyrics as any),
        });
        setEdit(true);
        onOpen();
    };

    const handleDeleteModal = () => {
        openDeleteModal();
    };

    const handleApprove = async () => {
        try {
            const response = await approveSong(song?._id as any);

            if (response.status === 'ok') {
                toast({
                    title: 'Song approved successfully',
                    variant: 'default',
                });
                await queryClient.invalidateQueries({
                    queryKey: ['requests', 'songs'],
                });
            }
        } catch (error) {
            toast({
                title: 'Oops! Something went wrong 💔',
                variant: 'destructive',
            });
        }
    };

    return (
        <div className="flex h-full flex-col">
            <div className="flex items-center p-2">
                <div className="flex items-center gap-2">
                    <Tooltip>
                        {tabs.currentTab.value !== 'my-songs' && (
                            <TooltipTrigger asChild>
                                <Button
                                    onClick={handleAddToFavourites}
                                    variant="ghost"
                                    size="icon"
                                    disabled={!song}
                                >
                                    <>
                                        {isSongPinned(song as SongSchema) ? (
                                            <HeartIcon
                                                fill="red"
                                                className="h-5 w-5"
                                            />
                                        ) : (
                                            <HeartIcon className="h-5 w-5" />
                                        )}
                                        <span className="sr-only">
                                            Add to favourites
                                        </span>
                                    </>
                                </Button>
                            </TooltipTrigger>
                        )}
                        <TooltipContent> Add to favourites</TooltipContent>
                    </Tooltip>
                    {(isAdmin || userId === song?.user_id) && (
                        <>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        onClick={handleEditModal}
                                        variant="ghost"
                                        size="icon"
                                        disabled={!song}
                                    >
                                        <>
                                            <Edit className="h-5 w-5" />
                                            <span className="sr-only">
                                                Edit
                                            </span>
                                        </>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent> Edit</TooltipContent>
                            </Tooltip>
                            {isAdmin &&
                                tabs.currentTab.value === 'requests' && (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                onClick={handleApprove}
                                                variant="ghost"
                                                size="icon"
                                                disabled={!song}
                                            >
                                                <>
                                                    <CheckIcon className="text-[#47B881] h-5 w-5" />
                                                    <span className="sr-only">
                                                        Approve
                                                    </span>
                                                </>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Approve</TooltipContent>
                                    </Tooltip>
                                )}
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        onClick={handleDeleteModal}
                                        variant="ghost"
                                        size="icon"
                                        disabled={!song}
                                    >
                                        {isAdmin &&
                                        tabs.currentTab.value === 'requests' ? (
                                            <>
                                                <X
                                                    strokeWidth={'2'}
                                                    className="h-5 w-5 text-red-700"
                                                />
                                                <span className="sr-only">
                                                    Decline
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <Trash2
                                                    strokeWidth={'2'}
                                                    className="h-5 w-5 text-red-700"
                                                />
                                                <span className="sr-only">
                                                    Delete
                                                </span>
                                            </>
                                        )}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    {isAdmin ? 'Decline' : 'Delete'}
                                </TooltipContent>
                            </Tooltip>
                        </>
                    )}
                </div>
                <div className="ml-auto flex items-center gap-2" />
                <Tooltip>
                    <TooltipTrigger asChild>
                        {token ? (
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
                                variant="ghost"
                                size="icon"
                            >
                                <LogIn className="h-4 w-4" />
                                <span className="sr-only">Log in</span>
                            </Button>
                        )}
                    </TooltipTrigger>
                    <TooltipContent>
                        {token ? 'Log out' : 'Log in'}
                    </TooltipContent>
                </Tooltip>
            </div>
            <Separator />
            {song ? (
                <div className="flex h-[90%] flex-col">
                    <div className="flex items-start p-4">
                        <div className="flex items-start gap-4 text-sm">
                            <div className="grid gap-1">
                                <div className="font-semibold">
                                    {song.title}
                                </div>
                                <div className="line-clamp-1 text-xs">
                                    {song.title}
                                </div>
                                <div className="line-clamp-1 text-xs">
                                    <div className="flex items-center mt-1 gap-2">
                                        <Badge variant={'default'}>
                                            {song.beat}
                                        </Badge>
                                        <Badge variant={'default'}>
                                            {song.language}
                                        </Badge>
                                        <Badge variant={'default'}>
                                            T-{song.tempo}
                                        </Badge>
                                        <Badge variant={'default'}>
                                            {song.style}
                                        </Badge>
                                        <Badge variant={'default'}>
                                            {song.scale}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {song.createdAt && (
                            <div className="ml-auto text-xs text-muted-foreground">
                                {format(new Date(song.createdAt), 'PPpp')}
                            </div>
                        )}
                    </div>
                    <Separator />
                    <ScrollArea className="h-[100%] whitespace-pre-wrap p-4 text-sm">
                        {JSON.parse(song?.lyrics)}
                    </ScrollArea>
                </div>
            ) : (
                <EmptyPlaceholder
                    title="No song selected"
                    description="Please select a song to display"
                />
            )}
        </div>
    );
}
