'use client';

import { Search } from 'lucide-react';

//@ts-ignore
import {
    deleteSong,
    getAllSongs,
    getMySongs,
    getRequestedSongs,
    getUserData,
} from '@/api/api-services';
import { TABProps, TABS } from '@/constants/tab-data';
import useAddSongModal from '@/hooks/use-add-modal';
import useDeleteModal from '@/hooks/use-delete-modal';
import { SongSchema, SongTabsDataProps } from '@/models/song';
import { useSongs } from '@/store/useSongs';
import { useQueries, useQueryClient } from '@tanstack/react-query';
import Cookies from 'js-cookie';
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

interface SongProps {
    defaultLayout: number[] | undefined;
    defaultCollapsed?: boolean;
    navCollapsedSize: number;
}

export function SongsSection({ defaultLayout = [20, 32, 48] }: SongProps) {
    const [songStore, setSongStore] = useSongs();
    const { toast } = useToast();
    const { onClose: closeDeleteModal } = useDeleteModal();
    const locallyStoredPinnedSongs = Cookies.get('pinnedSongs');

    const {
        isOpen,
        onClose,
        isEdit,
        onOpen: openAddSongModal,
    } = useAddSongModal();
    const queryClient = useQueryClient();
    const token = Cookies.get('token');
    const userID = Cookies.get('userId');
    const isAdmin = Cookies.get('isAdmin') === 'true';

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
                queryKey: ['user'],
                // Sorry for below code.I know its bad but then I have to do this..
                queryFn: async () =>
                    await getUserData().then(async (res) => {
                        await Cookies.set('userId', res._id);
                        await Cookies.set(
                            'isAdmin',
                            (res?.role === 'ADMIN').toString()
                        );
                        return res;
                    }),
                enabled: !!token,
            },
            {
                queryKey: ['my-songs'],
                queryFn: getMySongs,
                enabled:
                    songStore.currentTab.value === 'my-songs' &&
                    !!token &&
                    !!userID,
            },
            {
                queryKey: ['requests'],
                queryFn: getRequestedSongs,
                enabled:
                    songStore.currentTab.value === 'requests' &&
                    !!token &&
                    !!userID,
            },
        ],
    });

    const getFavourites = () => {
        return token
            ? results[0].data?.filter((i: SongSchema) => i.isPinned)
            : results[0]?.data?.filter((i: SongSchema) =>
                  JSON.parse(locallyStoredPinnedSongs || '[]').some(
                      (s: any) => s._id === i._id
                  )
              );
    };

    const songs: SongTabsDataProps = {
        all: results[0].data,
        'my-songs': results[2]?.data,
        favourites: getFavourites(),
        requests: results[3].data,
    };

    const getSongById = (id: string | null) => {
        return (
            songs[songStore.currentTab.value as keyof SongTabsDataProps]?.find(
                (i) => i?._id === id
            ) || null
        );
    };

    const handleDeleteSong = async () => {
        try {
            const response = await deleteSong(songStore.selected as any);
            console.log(response);

            if (response.status === 'ok') {
                toast({
                    title: 'Song deleted successfully',
                    variant: 'default',
                });
                await queryClient.invalidateQueries({
                    queryKey: ['my-songs'],
                });
                closeDeleteModal();
            }
        } catch (error) {
            toast({
                title: 'Oops! Something went wrong 💔',
                variant: 'destructive',
            });
        }
    };

    const isLoading =
        results[0].isFetching ||
        results[1].isFetching ||
        results[2].isFetching ||
        results[3].isFetching;

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
                            <TabsList className="ml-auto">
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
                        </div>
                        <Separator />
                        <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                            <form className="flex items-center gap-2">
                                <div className="relative flex-1">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search"
                                        className="pl-8"
                                    />
                                </div>
                                {showAddButton && (
                                    <Button
                                        type="button"
                                        className={!token ? 'hidden' : ''}
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
                                className="m-0 w-full h-full"
                            >
                                <List
                                    items={
                                        songs[
                                            tab.value as keyof SongTabsDataProps
                                        ]
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
