"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUpdatePlayBackIdMutation = exports.useEditFileMutation = exports.useEditFolderMutation = exports.useDelFileMutation = exports.useGetFolderMutation = exports.useAddFileMutation = exports.useDeleteFolderMutation = exports.useAddFolderMutation = exports.useGetAllFileAndFolderQuery = exports.fileApi = void 0;
const apiSlice_1 = require("../api/apiSlice");
exports.fileApi = apiSlice_1.apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllFileAndFolder: builder.query({
            query: () => ({
                url: "file/get-folders-files",
                method: "GET",
                credentials: "include",
            }),
        }),
        addFolder: builder.mutation({
            query: (body) => ({
                url: "file/create-folder",
                body,
                method: "POST",
                credentials: "include",
            }),
        }),
        getFolder: builder.mutation({
            query: (id) => ({
                url: `file/get-folder/${id}`,
                body: {},
                method: "POST",
                credentials: "include",
            }),
        }),
        deleteFolder: builder.mutation({
            query: (id) => ({
                url: `file/delete-folder/${id}`,
                method: "DELETE",
                credentials: "include",
            }),
        }),
        addFile: builder.mutation({
            query: (file) => ({
                url: "file/create-file",
                body: file,
                method: "POST",
                credentials: "include",
            }),
        }),
        delFile: builder.mutation({
            query: (id) => ({
                url: `file/delete-file/${id}`,
                method: "DELETE",
                credentials: "include",
            }),
        }),
        editFolder: builder.mutation({
            query: ({ id, name }) => ({
                url: `file/edit-folder/${id}`,
                body: {
                    name
                },
                method: "POST",
                credentials: "include",
            }),
        }),
        editFile: builder.mutation({
            query: ({ id, name }) => ({
                url: `file/edit-file/${id}`,
                body: {
                    name
                },
                method: "POST",
                credentials: "include",
            }),
        }),
        updatePlayBackId: builder.mutation({
            query: (body) => ({
                url: "file/update-playback",
                body,
                method: "POST",
                credentials: "include",
            }),
        }),
    })
});
exports.useGetAllFileAndFolderQuery = exports.fileApi.useGetAllFileAndFolderQuery, exports.useAddFolderMutation = exports.fileApi.useAddFolderMutation, exports.useDeleteFolderMutation = exports.fileApi.useDeleteFolderMutation, exports.useAddFileMutation = exports.fileApi.useAddFileMutation, exports.useGetFolderMutation = exports.fileApi.useGetFolderMutation, exports.useDelFileMutation = exports.fileApi.useDelFileMutation, exports.useEditFolderMutation = exports.fileApi.useEditFolderMutation, exports.useEditFileMutation = exports.fileApi.useEditFileMutation, exports.useUpdatePlayBackIdMutation = exports.fileApi.useUpdatePlayBackIdMutation;
