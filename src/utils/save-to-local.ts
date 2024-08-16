import Cookies from 'js-cookie';

export const addToFavouritesToLocalStorage = (song: any) => {
    let pinnedSongs: any = Cookies.get('pinnedSongs');
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
    Cookies.set('pinnedSongs', JSON.stringify(pinnedSongs));
}