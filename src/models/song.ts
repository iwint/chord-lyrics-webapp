export interface SongSchema {
    _id: string;
    title: string;
    scale: string;
    tempo: number;
    style: string;
    beat: string;
    status: string;
    isPinned: boolean;
    language: string;
    keyboardModal: string;
    lyrics: string;
    user_id: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface SongTabsDataProps {
    "all": Array<SongSchema>
    "my-songs": Array<SongSchema>
    "favourites": Array<SongSchema>,
    "requests": Array<SongSchema>
}