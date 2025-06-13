"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAddEbookUserMutation = exports.useEditEbookMutation = exports.useDeleteEbookMutation = exports.useCreateEbookMutation = exports.useGetEbookDetailAdminQuery = exports.useGetEbookDetailQuery = exports.useGetAllEbookQuery = exports.ebookApi = void 0;
const apiSlice_1 = require("../api/apiSlice");
exports.ebookApi = apiSlice_1.apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createEbook: builder.mutation({
            query: (data) => ({
                url: "create-ebook",
                method: "POST",
                body: data,
                credentials: "include",
            }),
        }),
        // getAllCourses: builder.query({
        //   query: () => ({
        //     url: "get-admin-courses",
        //     method: "GET",
        //     credentials: "include" as const,
        //   }),
        // }),
        deleteEbook: builder.mutation({
            query: (id) => ({
                url: `delete-ebook/${id}`,
                method: "DELETE",
                credentials: "include",
            }),
        }),
        editEbook: builder.mutation({
            query: ({ id, data }) => ({
                url: `edit-ebook/${id}`,
                method: "PUT",
                body: data,
                credentials: "include",
            }),
        }),
        addEbookUser: builder.mutation({
            query: (data) => ({
                url: `add-ebook-user`,
                method: "POST",
                body: data,
                credentials: "include",
            }),
        }),
        getAllEbook: builder.query({
            query: () => ({
                url: "get-ebooks",
                method: "GET",
                credentials: "include",
            }),
        }),
        getEbookDetail: builder.query({
            query: (id) => ({
                url: `get-ebook/${id}`,
                method: "GET",
                credentials: "include",
            }),
        }),
        getEbookDetailAdmin: builder.query({
            query: (id) => ({
                url: `get-admin-ebook/${id}`,
                method: "GET",
                credentials: "include",
            }),
        }),
        // getCourseContent: builder.query({
        //   query: (id) => ({
        //     url: `get-course-content/${id}`,
        //     method: "GET",
        //     credentials: "include" as const,
        //   }),
        // }),
        // addNewQuestion: builder.mutation({
        //   query: ({ question, courseId, contentId }) => ({
        //     url: "add-question",
        //     body: {
        //       question,
        //       courseId,
        //       contentId,
        //     },
        //     method: "PUT",
        //     credentials: "include" as const,
        //   }),
        // }),
        // addAnswerInQuestion: builder.mutation({
        //   query: ({ answer, courseId, contentId, questionId }) => ({
        //     url: "add-answer",
        //     body: {
        //       answer,
        //       courseId,
        //       contentId,
        //       questionId,
        //     },
        //     method: "PUT",
        //     credentials: "include" as const,
        //   }),
        // }),
        // addReviewInCourse: builder.mutation({
        //   query: ({ review, rating, courseId }: any) => ({
        //     url: `add-review/${courseId}`,
        //     body: {
        //       review,
        //       rating,
        //     },
        //     method: "PUT",
        //     credentials: "include" as const,
        //   }),
        // }),
        // addReplyInReview: builder.mutation({
        //   query: ({ comment, courseId, reviewId }: any) => ({
        //     url: `add-reply`,
        //     body: {
        //       comment, courseId, reviewId
        //     },
        //     method: "PUT",
        //     credentials: "include" as const,
        //   }),
        // }),
    }),
});
exports.useGetAllEbookQuery = exports.ebookApi.useGetAllEbookQuery, exports.useGetEbookDetailQuery = exports.ebookApi.useGetEbookDetailQuery, exports.useGetEbookDetailAdminQuery = exports.ebookApi.useGetEbookDetailAdminQuery, exports.useCreateEbookMutation = exports.ebookApi.useCreateEbookMutation, exports.useDeleteEbookMutation = exports.ebookApi.useDeleteEbookMutation, exports.useEditEbookMutation = exports.ebookApi.useEditEbookMutation, exports.useAddEbookUserMutation = exports.ebookApi.useAddEbookUserMutation;
