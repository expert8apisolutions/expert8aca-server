"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLoadUserQuery = exports.useRefreshTokenQuery = exports.apiSlice = void 0;
const react_1 = require("@reduxjs/toolkit/query/react");
const authSlice_1 = require("../auth/authSlice");
exports.apiSlice = (0, react_1.createApi)({
    reducerPath: "api",
    baseQuery: (0, react_1.fetchBaseQuery)({
        baseUrl: `${process.env.NEXT_PUBLIC_ORIGIN_URI}/api/v1`,
        credentials: 'include'
    }),
    endpoints: (builder) => ({
        refreshToken: builder.query({
            query: (data) => ({
                url: "refresh",
                method: "GET",
                credentials: "include",
            }),
        }),
        loadUser: builder.query({
            query: (data) => ({
                url: `me`,
                method: "GET",
                credentials: "include",
            }),
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    const result = await queryFulfilled;
                    dispatch((0, authSlice_1.userLoggedIn)({
                        accessToken: result.data.accessToken,
                        user: result.data.user,
                    }));
                }
                catch (error) {
                    console.log(error);
                }
            },
        }),
    }),
});
exports.useRefreshTokenQuery = exports.apiSlice.useRefreshTokenQuery, exports.useLoadUserQuery = exports.apiSlice.useLoadUserQuery;
