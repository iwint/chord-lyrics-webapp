"use strict";
exports.__esModule = true;
exports.useResendOtpMutation = exports.useVerifyOtpMutation = exports.useSignUpMutation = exports.useSignInMutation = exports.useGetMeQuery = exports.authApi = void 0;
var react_1 = require("@reduxjs/toolkit/query/react");
var baseApi_1 = require("./baseApi");
exports.authApi = react_1.createApi({
    reducerPath: 'authApi',
    baseQuery: baseApi_1.baseQuery,
    endpoints: function (builder) { return ({
        getMe: builder.query({
            query: function () { return '/auth/me'; }
        }),
        signIn: builder.mutation({
            query: function (credentials) { return ({
                url: '/auth/sign-in',
                method: 'POST',
                body: credentials
            }); }
        }),
        signUp: builder.mutation({
            query: function (userData) { return ({
                url: '/auth/sign-up',
                method: 'POST',
                body: userData
            }); }
        }),
        verifyOtp: builder.mutation({
            query: function (body) { return ({
                url: '/auth/verify-otp',
                method: 'POST',
                body: body
            }); }
        }),
        resendOtp: builder.mutation({
            query: function (body) { return ({
                url: '/auth/resend-otp',
                method: 'POST',
                body: body
            }); }
        })
    }); }
});
exports.useGetMeQuery = exports.authApi.useGetMeQuery, exports.useSignInMutation = exports.authApi.useSignInMutation, exports.useSignUpMutation = exports.authApi.useSignUpMutation, exports.useVerifyOtpMutation = exports.authApi.useVerifyOtpMutation, exports.useResendOtpMutation = exports.authApi.useResendOtpMutation;
