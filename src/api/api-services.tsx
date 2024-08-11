'use client';

import { GET, POST, PUT } from '@/api/api-config';

const userId = window.localStorage.getItem('userId');

export const getAllSongs = async () => {
    const response = await GET('song/getAllSongs');
    return response.data;
};

export const getSongIndex = async (language: string) => {
    const response = await GET(`song/getIndex?language=${language}`);
    return response;
};

export const getSongTitles = async (index: string) => {
    const response = await GET(`song/getSongTitles?index=${index}`);
    return response;
};

export const getSingleSong = async (id: string) => {
    const response = await GET(`song/getSong/${id}`);
    return response;
};

export const getLanguages = async (keyboard: string) => {
    const response = await GET(`song/getlanguages?keyboard=${keyboard}`);
    return response;
};

export const getKeyboards = async () => {
    const response = await GET(`song/getKeyboards`);
    return response;
};

export const getPendingSongs = async () => {
    const response = await GET(`song/getPendingSongs?userId=${userId}`);
    return response;
};

export const getMyPendingSongs = async () => {
    const response = await GET(`song/getMyPendingSongs?userId=${userId}`);
    return response;
};

export const getMySongs = async () => {
    const response = await GET(`song/getMySongs?userId=${userId}`);
    return response;
};

export const approveSong = async (songId: string) => {
    const response = await PUT(
        `song/approveSong?userId=${userId}&songId=${songId}`
    );
    return response;
};

export const updateSong = async (songId: string, payload: any) => {
    const response = await PUT(
        `song/updateSong?userId=${userId}&songId=${songId}`,
        payload
    );
    return response;
};

export const addSong = async (payload: any) => {
    const response = await POST(`song/addSong?userId=${userId}`, payload);
    return response;
};
