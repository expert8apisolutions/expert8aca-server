"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLogOutQuery = exports.useSocialAuthMutation = exports.useLoginMutation = exports.useActivationMutation = exports.useRegisterMutation = exports.authApi = void 0;
const apiSlice_1 = require("../api/apiSlice");
const authSlice_1 = require("./authSlice");
exports.authApi = apiSlice_1.apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // endpoints here
        register: builder.mutation({
            query: (data) => ({
                url: "registration",
                method: "POST",
                body: data,
                credentials: "include",
            }),
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    const result = await queryFulfilled;
                    dispatch((0, authSlice_1.userRegistration)({
                        token: result.data.activationToken,
                    }));
                }
                catch (error) {
                    console.log(error);
                }
            },
        }),
        activation: builder.mutation({
            query: ({ activation_token, activation_code }) => ({
                url: "activate-user",
                method: "POST",
                body: {
                    activation_token,
                    activation_code,
                },
            }),
        }),
        login: builder.mutation({
            query: ({ email, password }) => ({
                url: "login",
                method: "POST",
                body: {
                    email,
                    password,
                },
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
        socialAuth: builder.mutation({
            query: ({ email, name, avatar }) => ({
                url: `social-auth`,
                method: "POST",
                body: {
                    email,
                    name,
                    avatar,
                },
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
        logOut: builder.query({
            query: () => ({
                url: "logout",
                method: "GET",
                credentials: "include",
            }),
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    dispatch((0, authSlice_1.userLoggedOut)());
                }
                catch (error) {
                    console.log(error);
                }
            },
        }),
    }),
});
exports.useRegisterMutation = exports.authApi.useRegisterMutation, exports.useActivationMutation = exports.authApi.useActivationMutation, exports.useLoginMutation = exports.authApi.useLoginMutation, exports.useSocialAuthMutation = exports.authApi.useSocialAuthMutation, exports.useLogOutQuery = exports.authApi.useLogOutQuery;
