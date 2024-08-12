import { formatDistanceToNow } from 'date-fns';
import { ComponentProps } from 'react';

import { cn } from '@/lib/utils';
import { SongSchema } from '@/models/song';
import { useSongs } from '@/store/useSongs';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { EmptyPlaceholder } from './empty-placeholder';

interface ListProps {
    items: SongSchema[];
}

export function List({ items }: ListProps) {
    const [song, setSongStore] = useSongs();

    return (
        <ScrollArea className="h-screen">
            <div className="flex flex-col gap-2 p-4 pt-0">
                {items?.length > 0 ? (
                    items.map((item) => (
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
                                        {!item.isPinned && (
                                            <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                                        )}
                                    </div>
                                    <div
                                        className={cn(
                                            'ml-auto text-xs',
                                            song.selected === item._id
                                                ? 'text-foreground'
                                                : 'text-muted-foreground'
                                        )}
                                    >
                                        {formatDistanceToNow(
                                            new Date(item.createdAt),
                                            {
                                                addSuffix: true,
                                            }
                                        )}
                                    </div>
                                </div>
                                <div className="text-xs font-medium">
                                    {item.keyboardModal}
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Badge variant={'default'}>{item.beat}</Badge>
                                <Badge variant={'default'}>
                                    {item.language}
                                </Badge>
                                <Badge variant={'default'}>
                                    T-{item.tempo}
                                </Badge>
                                <Badge variant={'default'}>{item.style}</Badge>
                                <Badge variant={'default'}>{item.scale}</Badge>
                            </div>
                        </button>
                    ))
                ) : (
                    <EmptyPlaceholder />
                )}
            </div>
        </ScrollArea>
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
