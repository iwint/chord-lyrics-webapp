import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseApi';

export const aiChatApi = createApi({
  reducerPath: 'aiChatApi',
  baseQuery,
  tagTypes: ['History', 'UsageStatus'],
  endpoints: (builder) => ({
    getChatHistory: builder.query<any, void>({
      query: () => '/ai-chat/history',
      providesTags: ['History'],
    }),
    getUsageStatus: builder.query<any, void>({
      query: () => '/ai-chat/usage-status',
      providesTags: ['UsageStatus'],
    }),
    searchLyrics: builder.mutation<any, { query: string }>({
      query: (body) => ({
        url: '/ai-chat/search-lyrics',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['History', 'UsageStatus'],
    }),
  }),
});

export const {
  useGetChatHistoryQuery,
  useGetUsageStatusQuery,
  useSearchLyricsMutation,
} = aiChatApi;
