import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseApi';

export const aiChatApi = createApi({
  reducerPath: 'aiChatApi',
  baseQuery,
  tagTypes: ['History'],
  endpoints: (builder) => ({
    getChatHistory: builder.query<any, void>({
      query: () => '/ai-chat/history',
      providesTags: ['History'],
    }),
    searchLyrics: builder.mutation<any, { query: string }>({
      query: (body) => ({
        url: '/ai-chat/search-lyrics',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['History'],
    }),
  }),
});

export const {
  useGetChatHistoryQuery,
  useSearchLyricsMutation,
} = aiChatApi;
