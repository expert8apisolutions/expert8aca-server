"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUpdateNotificationStatusMutation = exports.useGetAllNotificationsQuery = exports.notificationsApi = void 0;
const apiSlice_1 = require("../api/apiSlice");
exports.notificationsApi = apiSlice_1.apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllNotifications: builder.query({
            query: () => ({
                url: "get-all-notifications",
                method: "GET",
                credentials: "include",
            }),
        }),
        updateNotificationStatus: builder.mutation({
            query: (id) => ({
                url: `/update-notification/${id}`,
                method: "PUT",
                credentials: "include",
            }),
        }),
    }),
});
exports.useGetAllNotificationsQuery = exports.notificationsApi.useGetAllNotificationsQuery, exports.useUpdateNotificationStatusMutation = exports.notificationsApi.useUpdateNotificationStatusMutation;
