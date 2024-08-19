import { SongSchema } from '@/models/song';
import Cookies from 'js-cookie';

export const addToFavouritesToLocalStorage = async (song: any) => {
    let pinnedSongs: any = await Cookies.get('pinnedSongs');
    pinnedSongs = pinnedSongs ? JSON.parse(pinnedSongs) : [];
    const isAlreadyPinned = pinnedSongs?.some(
        (i: any) => i._id === song?._id
    );
    if (isAlreadyPinned) {
        const index = pinnedSongs.findIndex(
            (i: any) => i._id === song?._id
        );
        pinnedSongs.splice(index, 1);
    } else {
        pinnedSongs.push({
            _id: song?._id,
            ...song,
        });
    }
    await Cookies.set('pinnedSongs', JSON.stringify(pinnedSongs));
}


export const isSongPinned = (song: SongSchema) => {
    const token = Cookies.get('token')
    const locallyStoredPinnedSongs = Cookies.get('pinnedSongs')

    if (token) {
        return song?.isPinned;
    } else {
        return JSON.parse(locallyStoredPinnedSongs || '[]').some(
            (i: any) => i._id === song?._id
        );
    }
};