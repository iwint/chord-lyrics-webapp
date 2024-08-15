'use client';

import { GET, POST, PUT } from '@/api/api-config';
import Cookies from 'js-cookie';

const userId = Cookies.get('userId');

export const getAllSongs = async () => {
    const response = await GET('song/getAllSongs');
    return response.data;
};

export const getUserData = async () => {
    const response = await GET('auth/userData');
    await Cookies.set('userId', response?.data?._id);
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
    const response = await GET(`song/getPendingSongs?userId=${userId}`);
    return response.data;
};

export const getMyPendingSongs = async () => {
    const response = await GET(`song/getMyPendingSongs?userId=${userId}`);
    return response.data;
};

export const getMySongs = async () => {
    const response = await GET(`song/getMySongs?userId=${userId}`);
    return response.data;
};

export const approveSong = async (songId: string) => {
    const response = await PUT(
        `song/approveSong?userId=${userId}&songId=${songId}`
    );
    return response.data;
};

export const updateSong = async (songId: string, payload: any) => {
    const response = await PUT(
        `/song/updateSong/${songId}?userId=${userId}`,
        payload
    );
    return response.data;
};

export const addSong = async (payload: any) => {
    const response = await POST(`song/addSong?userId=${userId}`, payload);
    return response;
};
