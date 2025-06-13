"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGetOrdersAnalyticsQuery = exports.useGetUsersAnalyticsQuery = exports.useGetCoursesAnalyticsQuery = exports.analyticsApi = void 0;
const apiSlice_1 = require("../api/apiSlice");
exports.analyticsApi = apiSlice_1.apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCoursesAnalytics: builder.query({
            query: () => ({
                url: 'get-courses-analytics',
                method: 'GET',
                credentials: 'include',
            }),
        }),
        getUsersAnalytics: builder.query({
            query: () => ({
                url: 'get-users-analytics',
                method: 'GET',
                credentials: 'include',
            })
        }),
        getOrdersAnalytics: builder.query({
            query: () => ({
                url: 'get-orders-analytics',
                method: 'GET',
                credentials: 'include',
            })
        }),
    }),
});
exports.useGetCoursesAnalyticsQuery = exports.analyticsApi.useGetCoursesAnalyticsQuery, exports.useGetUsersAnalyticsQuery = exports.analyticsApi.useGetUsersAnalyticsQuery, exports.useGetOrdersAnalyticsQuery = exports.analyticsApi.useGetOrdersAnalyticsQuery;
