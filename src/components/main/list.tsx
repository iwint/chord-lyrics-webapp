import { formatDistanceToNow } from 'date-fns';
import { ComponentProps } from 'react';

import { addToFavourites, getAllSongs } from '@/api/api-services';
import { cn } from '@/lib/utils';
import { SongSchema } from '@/models/song';
import { useSongs } from '@/store/useSongs';
import {
    addToFavouritesToLocalStorage,
    isSongPinned,
} from '@/utils/save-to-local';
import { useQueryClient } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { HeartIcon } from 'lucide-react';
import { Badge } from '../ui/badge';
import { useToast } from '../ui/use-toast';
import { EmptyPlaceholder } from './empty-placeholder';

interface ListProps {
    items: SongSchema[];
}

export function List({ items }: ListProps) {
    const [song, setSongStore] = useSongs();
    const token = Cookies.get('token');
    const userId = Cookies.get('userId');
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const handleAddToFavourites = async (song: SongSchema) => {
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

    return (
        <div className="h-full w-full">
            <div className="flex h-[80%] w-full overflow-y-auto flex-col gap-2 p-4 pt-0">
                {items?.length > 0 ? (
                    items?.map((item) => (
                        <button
                            key={item._id}
                            className={cn(
                                'flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent',
                                song.selected === item._id && 'bg-muted'
                            )}
                            onClick={() =>
                                setSongStore({
                                    ...song,
                                    selected: item._id,
                                })
                            }
                        >
                            <div className="flex w-full flex-col gap-1">
                                <div className="flex items-center">
                                    <div className="flex items-center gap-2">
                                        <div className="font-semibold">
                                            {item.title}
                                        </div>
                                    </div>
                                    {userId !== item.user_id && (
                                        <div
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleAddToFavourites(item);
                                            }}
                                            className={cn(
                                                'ml-auto text-xs hover:opacity-65',
                                                song.selected === item._id
                                                    ? 'text-foreground'
                                                    : 'text-muted-foreground'
                                            )}
                                        >
                                            {isSongPinned(item) ? (
                                                <HeartIcon
                                                    fill="red"
                                                    strokeWidth={'1'}
                                                    className="h-5 w-5"
                                                />
                                            ) : (
                                                <HeartIcon className="h-5 w-5" />
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className="text-xs font-medium">
                                    {item.keyboardModal}
                                </div>
                            </div>

                            <div className="flex items-center justify-between w-full gap-2">
                                <div className="flex items-center gap-2">
                                    <Badge variant={'default'}>
                                        {item.beat}
                                    </Badge>
                                    <Badge variant={'default'}>
                                        {item.language}
                                    </Badge>
                                    <Badge variant={'default'}>
                                        T-{item.tempo}
                                    </Badge>
                                    <Badge variant={'default'}>
                                        {item.style}
                                    </Badge>
                                    <Badge variant={'default'}>
                                        {item.scale}
                                    </Badge>
                                    {item.user_id === userId && (
                                        <Badge
                                            className={cn(
                                                item.status === 'active'
                                                    ? 'bg-green-500'
                                                    : 'bg-red-500',
                                                'capitalize'
                                            )}
                                            variant={'default'}
                                        >
                                            {item?.status}
                                        </Badge>
                                    )}
                                </div>
                                <div>
                                    {formatDistanceToNow(
                                        new Date(item.createdAt),
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

function getBadgeVariantFromLabel(
    label: string
): ComponentProps<typeof Badge>['variant'] {
    if (['work'].includes(label.toLowerCase())) {
        return 'default';
    }

    if (['personal'].includes(label.toLowerCase())) {
        return 'outline';
    }

    return 'secondary';
}
