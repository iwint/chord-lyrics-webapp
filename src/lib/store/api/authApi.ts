import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseApi';

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery,
    endpoints: (builder) => ({
        getMe: builder.query<any, void>({
            query: () => '/auth/me',
        }),
        signIn: builder.mutation<any, any>({
            query: (credentials) => ({
                url: '/auth/sign-in',
                method: 'POST',
                body: credentials,
            }),
        }),
        signUp: builder.mutation<any, any>({
            query: (userData) => ({
                url: '/auth/sign-up',
                method: 'POST',
                body: userData,
            }),
        }),
        verifyOtp: builder.mutation<any, { user_id: string; otp: string }>({
            query: (body) => ({
                url: '/auth/verify-otp',
                method: 'POST',
                body,
            }),
        }),
        resendOtp: builder.mutation<any, { user_id: string }>({
            query: (body) => ({
                url: '/auth/resend-otp',
                method: 'POST',
                body,
            }),
        }),
    }),
});

export const {
    useGetMeQuery,
    useSignInMutation,
    useSignUpMutation,
    useVerifyOtpMutation,
    useResendOtpMutation,
} = authApi;
