import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseApi';

export const songsApi = createApi({
  reducerPath: 'songsApi',
  baseQuery,
  tagTypes: ['Songs', 'Song'],
  endpoints: (builder) => ({
    getAllSongs: builder.query<any, void>({
      query: () => '/songs',
      providesTags: ['Songs'],
    }),
    getMySongs: builder.query<any, void>({
      query: () => '/songs/my-songs',
      providesTags: ['Songs'],
    }),
    getPendingSongs: builder.query<any, void>({
      query: () => '/songs/pending',
      providesTags: ['Songs'],
    }),
    searchSongs: builder.query<any, string>({
      query: (q) => `/songs/search?q=${encodeURIComponent(q)}`,
      providesTags: ['Songs'],
    }),
    getSong: builder.query<any, string>({
      query: (id) => `/songs/${id}`,
      providesTags: (result, error, id) => [{ type: 'Song', id }],
    }),
    createSong: builder.mutation<any, any>({
      query: (body) => ({
        url: '/songs',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Songs'],
    }),
    updateSong: builder.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({
        url: `/songs/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Song', id },
        'Songs',
      ],
    }),
    deleteSong: builder.mutation<any, string>({
      query: (id) => ({
        url: `/songs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Songs'],
    }),
    approveSong: builder.mutation<any, string>({
      query: (id) => ({
        url: `/songs/${id}/approve`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Song', id },
        'Songs',
      ],
    }),
    rejectSong: builder.mutation<any, string>({
      query: (id) => ({
        url: `/songs/${id}/reject`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Song', id },
        'Songs',
      ],
    }),
  }),
});

export const {
  useGetAllSongsQuery,
  useGetMySongsQuery,
  useGetPendingSongsQuery,
  useSearchSongsQuery,
  useGetSongQuery,
  useCreateSongMutation,
  useUpdateSongMutation,
  useDeleteSongMutation,
  useApproveSongMutation,
  useRejectSongMutation,
} = songsApi;
