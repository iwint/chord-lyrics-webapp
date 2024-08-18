'use client';

import { DELETE, GET, POST, PUT } from '@/api/api-config';
import Cookies from 'js-cookie';

export const getAllSongs = async () => {
    const response = await GET('song/getAllSongs');
    return response.data;
};

export const getUserData = async () => {
    const response = await GET('auth/userData');
    return response.data;
};

export const getSongIndex = async (language: string) => {
    const response = await GET(`song/getIndex?language=${language}`);
    return response.data;
};

export const getSongTitles = async (index: string) => {
    const response = await GET(`song/getSongTitles?index=${index}`);
    return response.data;
};

export const getSingleSong = async (id: string) => {
    const response = await GET(`song/getSong/${id}`);
    return response.data;
};

export const getLanguages = async (keyboard: string) => {
    const response = await GET(`song/getlanguages?keyboard=${keyboard}`);
    return response.data;
};

export const getKeyboards = async () => {
    const response = await GET(`song/getKeyboards`);
    return response.data;
};

export const getPendingSongs = async () => {
    const userId = await Cookies.get('userId');
    const response = await GET(`song/getPendingSongs?userId=${userId}`);
    return response.data;
};

export const getMyPendingSongs = async () => {
    const userId = await Cookies.get('userId');
    const response = await GET(`song/getMyPendingSongs?userId=${userId}`);
    return response.data;
};

export const getMySongs = async () => {
    const userId = await Cookies.get('userId');
    const response = await GET(`song/getMySongs?userId=${userId}`);
    return response.data;
};

export const approveSong = async (songId: string) => {
    const userId = await Cookies.get('userId');
    const response = await PUT(
        `song/approveSong?userId=${userId}&songId=${songId}`
    );
    return response.data;
};

export const updateSong = async (songId: string, payload: any) => {
    const userId = await Cookies.get('userId');
    const response = await PUT(
        `song/updateSong/${songId}?userId=${userId}`,
        payload
    );
    return response;
};

export const addSong = async (payload: any) => {
    const userId = await Cookies.get('userId');
    const response = await POST(`song/addSong?userId=${userId}`, payload);
    return response;
};

export const addToFavourites = async (
    songID: string,
    payload: { isPinned: boolean }
) => {
    const userId = await Cookies.get('userId');
    const response = await PUT(
        `song/pinsong/${songID}?userId=${userId}`,
        payload
    );
    return response;
};

export const deleteSong = async (songID: string) => {
    const userId = await Cookies.get('userId');
    const response = await DELETE(`song/delete/${songID}?userId=${userId}`);
    return response;
};

export const getRequestedSongs = async () => {
    const userId = await Cookies.get('userId');
    const response = await GET(`song/getPendingSongs?userId=${userId}`);
    return response.data;
};
