"use strict";
exports.__esModule = true;
exports.baseQuery = void 0;
var react_1 = require("@reduxjs/toolkit/query/react");
var js_cookie_1 = require("js-cookie");
exports.baseQuery = react_1.fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL + "/api/v1",
    prepareHeaders: function (headers) {
        var token = js_cookie_1["default"].get('token');
        if (token) {
            headers.set('authorization', "Bearer " + token);
        }
        return headers;
    }
});
