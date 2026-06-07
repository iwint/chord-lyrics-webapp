import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseApi';
import { songsApi } from './songsApi';

export const pinsApi = createApi({
  reducerPath: 'pinsApi',
  baseQuery,
  tagTypes: ['Pins'],
  endpoints: (builder) => ({
    getPinnedSongs: builder.query<any, void>({
      query: () => '/pins',
      providesTags: ['Pins'],
    }),
    pinSong: builder.mutation<any, string>({
      query: (songId) => ({
        url: `/pins/${songId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Pins'],
      async onQueryStarted(songId, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Invalidate songs lists to update the pin status
          dispatch(songsApi.util.invalidateTags(['Songs']));
        } catch {}
      },
    }),
    unpinSong: builder.mutation<any, string>({
      query: (songId) => ({
        url: `/pins/${songId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Pins'],
      async onQueryStarted(songId, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Invalidate songs lists to update the pin status
          dispatch(songsApi.util.invalidateTags(['Songs']));
        } catch {}
      },
    }),
  }),
});

export const {
  useGetPinnedSongsQuery,
  usePinSongMutation,
  useUnpinSongMutation,
} = pinsApi;
