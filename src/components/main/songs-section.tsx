'use client';

import { Search } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { TABProps, TABS } from '@/constants/tab-data';
import useAddSongModal from '@/hooks/use-add-modal';
import useDeleteModal from '@/hooks/use-delete-modal';
import { SongTabsDataProps } from '@/models/song';
import { useSongs } from '@/store/useSongs';
import DeleteModal from '../common/delete-modal';
import Loader from '../common/loader';
import Modal from '../common/modal';
import AddSongForm from '../forms/song-form';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from '../ui/resizable';
import { Separator } from '../ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useToast } from '../ui/use-toast';
import { List } from './list';
import { SongDisplay } from './song-display';
import { ThemeToggle } from '../common/ThemeToggle';

// Redux
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store/store';
import {
    useGetAllSongsQuery,
    useGetMySongsQuery,
    useGetPendingSongsQuery,
    useSearchSongsQuery,
    useDeleteSongMutation,
} from '@/lib/store/api/songsApi';
import { useGetPinnedSongsQuery } from '@/lib/store/api/pinsApi';

interface SongProps {
    defaultLayout: number[] | undefined;
    defaultCollapsed?: boolean;
    navCollapsedSize: number;
}

// Debounce hook for search
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
}

export function SongsSection({ defaultLayout = [20, 32, 48] }: SongProps) {
    const [songStore, setSongStore] = useSongs();
    const { toast } = useToast();
    const { onClose: closeDeleteModal } = useDeleteModal();
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearch = useDebounce(searchQuery, 400);

    const {
        isOpen,
        onClose,
        isEdit,
        onOpen: openAddSongModal,
    } = useAddSongModal();

    // Redux Auth State
    const { isAuthenticated, isAdmin } = useSelector((state: RootState) => state.auth);

    // RTK Queries
    const { data: allRes, isFetching: isAllFetching } = useGetAllSongsQuery();
    const { data: searchRes, isFetching: isSearchFetching } = useSearchSongsQuery(debouncedSearch, {
        skip: debouncedSearch.trim() === '',
    });
    const { data: myRes, isFetching: isMyFetching } = useGetMySongsQuery(undefined, { skip: !isAuthenticated });
    const { data: pinsRes, isFetching: isPinsFetching } = useGetPinnedSongsQuery(undefined, { skip: !isAuthenticated });
    const { data: pendingRes, isFetching: isPendingFetching } = useGetPendingSongsQuery(undefined, { skip: !isAdmin });

    // RTK Mutations
    const [deleteSong] = useDeleteSongMutation();

    const handleCurrentTab = (tab: TABProps) => {
        setSongStore({
            ...songStore,
            currentTab: tab,
        });
    };

    // Use search results if there's a query, otherwise use all approved songs
    const allSongsList = debouncedSearch.trim() !== '' ? searchRes?.data : allRes?.data;

    const songs: SongTabsDataProps = {
        all: allSongsList,
        'my-songs': myRes?.data,
        favourites: pinsRes?.data,
        requests: pendingRes?.data,
    };

    const getSongById = (id: string | null) => {
        if (!id) return null;
        // Search across all tab arrays to find the active song
        for (const key of Object.keys(songs)) {
            const arr = songs[key as keyof SongTabsDataProps];
            if (arr) {
                const found = arr.find((i: any) => i.song_id === id);
                if (found) return found;
            }
        }
        return null;
    };

    const handleDeleteSong = async () => {
        try {
            if (!songStore.selected) return;
            await deleteSong(songStore.selected).unwrap();
            
            toast({
                title: 'Song deleted successfully',
                variant: 'default',
            });
            closeDeleteModal();
            setSongStore({ ...songStore, selected: null });
        } catch (error) {
            toast({
                title: 'Oops! Something went wrong 💔',
                variant: 'destructive',
            });
        }
    };

    const isLoading =
        isAllFetching ||
        isSearchFetching ||
        isMyFetching ||
        isPinsFetching ||
        isPendingFetching;

    const getTabData = () => {
        if (isAdmin) {
            return TABS;
        } else {
            return TABS.filter((i) => !i.admin);
        }
    };

    const showAddButton = !['requests', 'favourites'].includes(
        songStore.currentTab.value
    );

    return (
        <>
            <Modal
                close={onClose}
                open={isOpen}
                title={isEdit ? 'Edit song' : 'Add song'}
                description={`Fill the form below to ${
                    isEdit ? 'edit' : 'add'
                } your song.`}
            >
                <AddSongForm />
            </Modal>
            <DeleteModal handleDelete={handleDeleteSong} />
            <Loader isLoading={isLoading} />
            
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
                    <Tabs
                        className="h-full"
                        defaultValue={songStore.currentTab.value}
                    >
                        <div className="flex items-center px-4 py-2">
                            <h1 className="text-xl font-bold">
                                {songStore.currentTab.label}
                            </h1>
                            <TabsList className="ml-auto mr-2">
                                {getTabData().map((tab, index) => (
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
                            <ThemeToggle />
                        </div>
                        <Separator />
                        <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                            <form className="flex items-center gap-2" onSubmit={(e) => e.preventDefault()}>
                                <div className="relative flex-1">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search by title, scale, language..."
                                        className="pl-8"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                {showAddButton && (
                                    <Button
                                        type="button"
                                        className={!isAuthenticated ? 'hidden' : ''}
                                        onClick={openAddSongModal}
                                    >
                                        Add song
                                    </Button>
                                )}
                            </form>
                        </div>
                        {getTabData().map((tab, index) => (
                            <TabsContent
                                key={index}
                                value={tab.value}
                                className="m-0 w-full h-[calc(100vh-130px)] overflow-hidden"
                            >
                                <List
                                    items={
                                        songs[
                                            tab.value as keyof SongTabsDataProps
                                        ] || []
                                    }
                                />
                            </TabsContent>
                        ))}
                    </Tabs>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={defaultLayout[2]} minSize={30}>
                    <SongDisplay song={getSongById(songStore.selected)} />
                </ResizablePanel>
            </ResizablePanelGroup>
        </>
    );
}
