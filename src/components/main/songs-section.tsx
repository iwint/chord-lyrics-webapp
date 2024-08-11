'use client';

import { Search } from 'lucide-react';

//@ts-ignore
import { getAllSongs, getMySongs } from '@/api/api-services';
import { TABProps, TABS } from '@/constants/tab-data';
import { SongSchema } from '@/models/song';
import { useSongs } from '@/store/useSongs';
import { useQueries } from '@tanstack/react-query';
import { Input } from '../ui/input';
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from '../ui/resizable';
import { Separator } from '../ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { TooltipProvider } from '../ui/tooltip';
import { List } from './list';
import { MailDisplay } from './main-display';

interface SongProps {
    defaultLayout: number[] | undefined;
    defaultCollapsed?: boolean;
    navCollapsedSize: number;
}

export function SongsSection({ defaultLayout = [20, 32, 48] }: SongProps) {
    const [songStore, setSongStore] = useSongs();
    const handleCurrentTab = (tab: TABProps) => {
        setSongStore({
            ...songStore,
            currentTab: tab,
        });
    };

    const results = useQueries({
        queries: [
            {
                queryKey: ['songs'],
                queryFn: getAllSongs,
            },
            {
                queryKey: ['my-songs'],
                queryFn: getMySongs,
                enabled: songStore.currentTab.value === 'my-songs',
            },
        ],
    });

    const songs = {
        all: results[0].data,
        'my-songs': results[1].data,
    };

    return (
        <TooltipProvider delayDuration={0}>
            <ResizablePanelGroup
                direction="horizontal"
                onLayout={(sizes: number[]) => {
                    document.cookie = `react-resizable-panels:layout:song=${JSON.stringify(
                        sizes
                    )}`;
                }}
                className="h-full items-stretch"
            >
                <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
                    <Tabs defaultValue={songStore.currentTab.value}>
                        <div className="flex items-center px-4 py-2">
                            <h1 className="text-xl font-bold">
                                {songStore.currentTab.label}
                            </h1>
                            <TabsList className="ml-auto">
                                {TABS.map((tab, index) => (
                                    <TabsTrigger
                                        onClick={() => handleCurrentTab(tab)}
                                        key={index.toString()}
                                        value={tab.value}
                                        className="text-zinc-600 dark:text-zinc-200"
                                    >
                                        {tab.label}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </div>
                        <Separator />
                        <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                            <form>
                                <div className="relative">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search"
                                        className="pl-8"
                                    />
                                </div>
                            </form>
                        </div>
                        {TABS.map((tab, index) => (
                            <TabsContent
                                key={index}
                                value={tab.value}
                                className="m-0"
                            >
                                <List
                                    items={
                                        tab.value === 'favourites'
                                            ? songs['all']?.filter(
                                                  (i: SongSchema) => i.isPinned
                                              )
                                            : songs[
                                                  (tab.value as 'all') ||
                                                      'my-songs'
                                              ]
                                    }
                                />
                            </TabsContent>
                        ))}
                    </Tabs>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={defaultLayout[2]} minSize={30}>
                    <MailDisplay
                        song={
                            songs[
                                (songStore.currentTab.value as 'all') ||
                                    'my-songs'
                            ]?.find(
                                (item: SongSchema) =>
                                    item._id === songStore.selected
                            ) || null
                        }
                    />
                </ResizablePanel>
            </ResizablePanelGroup>
        </TooltipProvider>
    );
}
