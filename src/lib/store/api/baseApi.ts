import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

export const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:8000/api/v1',
  prepareHeaders: (headers) => {
    const token = Cookies.get('token');
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});
