import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';
import { logout } from '../slices/authSlice';

const rawBaseQuery = fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1`,
    prepareHeaders: (headers) => {
        const token = Cookies.get('token');
        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

export const baseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
    args,
    api,
    extraOptions
) => {
    const result = await rawBaseQuery(args, api, extraOptions);

    if (result.error?.status === 401) {
        // Token is invalid or expired — reset auth state so the user can log in again
        api.dispatch(logout());
    }

    return result;
};
