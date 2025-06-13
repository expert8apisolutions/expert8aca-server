"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGetQuizInfoQuery = exports.useGetQuizStatusMutation = exports.useSubmitQuizMutation = exports.useStartQuizMutation = exports.useGetQuizByIdQuery = exports.useGetAllQuizQuery = exports.useDeleteQuizMutation = exports.useUpdateQuizMutation = exports.useCreateQuizMutation = exports.quizApi = void 0;
const apiSlice_1 = require("../api/apiSlice");
exports.quizApi = apiSlice_1.apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createQuiz: builder.mutation({
            query: (body) => ({
                url: "/admin/quiz",
                method: "POST",
                body,
                credentials: "include",
            }),
        }),
        updateQuiz: builder.mutation({
            query: ({ quizId, body }) => ({
                url: `/admin/quiz/${quizId}`,
                method: "PUT",
                body,
                credentials: "include",
            }),
        }),
        deleteQuiz: builder.mutation({
            query: (quizId) => ({
                url: `/admin/quiz/${quizId}`,
                method: "DELETE",
                credentials: "include",
            }),
        }),
        getAllQuiz: builder.query({
            query: () => ({
                url: "/admin/quiz",
                method: "GET",
                credentials: "include",
            }),
        }),
        getQuizById: builder.query({
            query: (quiz_id) => ({
                url: `/admin/quiz/${quiz_id}`,
                method: "GET",
                credentials: "include",
            }),
        }),
        startQuiz: builder.mutation({
            query: ({ quizId, body }) => ({
                url: `/quiz/${quizId}/start`,
                method: "POST",
                body,
                credentials: "include",
            }),
        }),
        submitQuiz: builder.mutation({
            query: ({ quizId, body }) => ({
                url: `/quiz/${quizId}/submit`,
                method: "POST",
                body,
                credentials: "include",
            }),
        }),
        getQuizStatus: builder.mutation({
            query: ({ quizId, body }) => ({
                url: `/quiz/${quizId}/status`,
                method: "POST",
                body,
                credentials: "include",
            }),
        }),
        getQuizInfo: builder.query({
            query: ({ quiz_id, course_id }) => ({
                url: `/quiz/${course_id}/${quiz_id}`,
                method: "GET",
                credentials: "include",
            }),
        }),
    }),
});
exports.useCreateQuizMutation = exports.quizApi.useCreateQuizMutation, exports.useUpdateQuizMutation = exports.quizApi.useUpdateQuizMutation, exports.useDeleteQuizMutation = exports.quizApi.useDeleteQuizMutation, exports.useGetAllQuizQuery = exports.quizApi.useGetAllQuizQuery, exports.useGetQuizByIdQuery = exports.quizApi.useGetQuizByIdQuery, exports.useStartQuizMutation = exports.quizApi.useStartQuizMutation, exports.useSubmitQuizMutation = exports.quizApi.useSubmitQuizMutation, exports.useGetQuizStatusMutation = exports.quizApi.useGetQuizStatusMutation, exports.useGetQuizInfoQuery = exports.quizApi.useGetQuizInfoQuery;
