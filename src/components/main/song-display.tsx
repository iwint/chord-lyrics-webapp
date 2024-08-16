'use client';

import { HeartIcon, LogIn, LogOut } from 'lucide-react';

import { format } from 'date-fns';

import { addToFavourites, getAllSongs } from '@/api/api-services';
import { SongSchema } from '@/models/song';
import { addToFavouritesToLocalStorage } from '@/utils/save-to-local';
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
    const today = new Date();
    const router = useRouter();
    const token = Cookies.get('token');
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const handleLogout = () => {
        Cookies.remove('token');
        Cookies.remove('userId');
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

    return (
        <div className="flex h-full flex-col">
            <div className="flex items-center p-2">
                <div className="flex items-center gap-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                onClick={handleAddToFavourites}
                                variant="ghost"
                                size="icon"
                                disabled={!song}
                            >
                                <>
                                    {song?.isPinned ? (
                                        <HeartIcon
                                            fill="red"
                                            className="h-5 w-5"
                                        />
                                    ) : (
                                        <HeartIcon className="h-4 w-4" />
                                    )}
                                    <span className="sr-only">
                                        Add to favourites
                                    </span>
                                </>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent> Add to favourites</TooltipContent>
                    </Tooltip>
                </div>
                <div className="ml-auto flex items-center gap-2"></div>
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
                        {JSON.parse(song.lyrics)}
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
