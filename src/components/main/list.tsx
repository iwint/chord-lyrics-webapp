import { formatDistanceToNow } from 'date-fns';
import { ComponentProps } from 'react';
import { cn } from '@/lib/utils';
import { useSongs } from '@/store/useSongs';
import { HeartIcon } from 'lucide-react';
import { Badge } from '../ui/badge';
import { useToast } from '../ui/use-toast';
import { EmptyPlaceholder } from './empty-placeholder';

// Redux
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';
import { usePinSongMutation, useUnpinSongMutation, useGetPinnedSongsQuery } from '@/lib/store/api/pinsApi';

interface ListProps {
    items: any[];
}

export function List({ items }: ListProps) {
    const [song, setSongStore] = useSongs();
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
    const { data: pinsRes } = useGetPinnedSongsQuery(undefined, { skip: !isAuthenticated });
    
    const [pinSong] = usePinSongMutation();
    const [unpinSong] = useUnpinSongMutation();
    
    const { toast } = useToast();

    // Determine if song is pinned based on RTK Query pins data
    const isSongPinned = (songId: string) => {
        if (!isAuthenticated || !pinsRes?.data) return false;
        return pinsRes.data.some((pinnedSong: any) => pinnedSong.song_id === songId);
    };

    const handleTogglePin = async (item: any) => {
        if (!isAuthenticated) {
            toast({ title: 'Please sign in to pin songs', variant: 'destructive' });
            return;
        }

        try {
            const currentlyPinned = isSongPinned(item.song_id);
            if (currentlyPinned) {
                await unpinSong(item.song_id).unwrap();
                toast({ title: 'Removed from favourites' });
            } else {
                await pinSong(item.song_id).unwrap();
                toast({ title: 'Added to favourites' });
            }
        } catch (error) {
            toast({ title: 'Failed to update favourites', variant: 'destructive' });
        }
    };

    return (
        <div className="h-full w-full">
            <div className="flex h-full w-full overflow-y-auto flex-col gap-2 p-4 pt-0 pb-10">
                {items?.length > 0 ? (
                    items?.map((item) => (
                        <button
                            key={item.song_id}
                            className={cn(
                                'flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent/50 glass',
                                song.selected === item.song_id && 'bg-accent/80 border-primary/50'
                            )}
                            onClick={() =>
                                setSongStore({
                                    ...song,
                                    selected: item.song_id,
                                })
                            }
                        >
                            <div className="flex w-full flex-col gap-1">
                                <div className="flex items-center">
                                    <div className="flex items-center gap-2">
                                        <div className="font-semibold text-base tracking-tight text-foreground/90">
                                            {item.title}
                                        </div>
                                    </div>
                                    {user?.user_id !== item.user_id && (
                                        <div
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleTogglePin(item);
                                            }}
                                            className={cn(
                                                'ml-auto text-xs hover:scale-110 transition-transform',
                                                song.selected === item.song_id
                                                    ? 'text-foreground'
                                                    : 'text-muted-foreground'
                                            )}
                                        >
                                            {isSongPinned(item.song_id) ? (
                                                <HeartIcon
                                                    fill="currentColor"
                                                    className="h-5 w-5 text-destructive"
                                                />
                                            ) : (
                                                <HeartIcon className="h-5 w-5 hover:text-destructive/70" />
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className="text-xs font-medium text-muted-foreground">
                                    {item.keyboardModal}
                                </div>
                            </div>

                            <div className="flex items-center justify-between w-full gap-2 mt-2">
                                <div className="flex flex-wrap items-center gap-1.5">
                                    <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-transparent">
                                        {item.scale}
                                    </Badge>
                                    <Badge variant="outline" className="border-border/50">
                                        {item.language}
                                    </Badge>
                                    <Badge variant="outline" className="border-border/50">
                                        {item.beat}
                                    </Badge>
                                    <Badge variant="outline" className="border-border/50">
                                        T-{item.tempo}
                                    </Badge>
                                    <Badge variant="outline" className="border-border/50">
                                        {item.style}
                                    </Badge>
                                    {item.user_id === user?.user_id && (
                                        <Badge
                                            className={cn(
                                                item.status === 'ACTIVE'
                                                    ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'
                                                    : 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20',
                                                'capitalize border-transparent'
                                            )}
                                            variant={'outline'}
                                        >
                                            {item?.status?.toLowerCase()}
                                        </Badge>
                                    )}
                                </div>
                                <div className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                    {formatDistanceToNow(
                                        new Date(item.created_at || new Date()),
                                        {
                                            addSuffix: true,
                                        }
                                    )}
                                </div>
                            </div>
                        </button>
                    ))
                ) : (
                    <EmptyPlaceholder isActionView />
                )}
            </div>
        </div>
    );
}
