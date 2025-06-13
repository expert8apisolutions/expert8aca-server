"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGetBlogContentByIdQuery = exports.useGetBlogContentQuery = exports.useEditBlogMutation = exports.useDeleteBlogMutation = exports.useGetAllBlogQuery = exports.useCreateBlogMutation = exports.blogsApi = void 0;
const apiSlice_1 = require("../api/apiSlice");
exports.blogsApi = apiSlice_1.apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createBlog: builder.mutation({
            query: (data) => ({
                url: "create-blog",
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
        deleteBlog: builder.mutation({
            query: (id) => ({
                url: `delete-blog/${id}`,
                method: "DELETE",
                credentials: "include",
            }),
        }),
        editBlog: builder.mutation({
            query: ({ id, data }) => ({
                url: `/edit-blog/${id}`,
                method: "PUT",
                body: data,
                credentials: "include",
            }),
        }),
        getAllBlog: builder.query({
            query: () => ({
                url: "get-all-blog",
                method: "GET",
                credentials: "include",
            }),
        }),
        getBlogContent: builder.query({
            query: (id) => ({
                url: `get-blog/${id}`,
                method: "GET",
                credentials: "include",
            }),
        }),
        getBlogContentById: builder.query({
            query: (id) => ({
                url: `get-blog-byid/${id}`,
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
exports.useCreateBlogMutation = exports.blogsApi.useCreateBlogMutation, exports.useGetAllBlogQuery = exports.blogsApi.useGetAllBlogQuery, exports.useDeleteBlogMutation = exports.blogsApi.useDeleteBlogMutation, exports.useEditBlogMutation = exports.blogsApi.useEditBlogMutation, 
// useGetUsersAllCoursesQuery,
exports.useGetBlogContentQuery = exports.blogsApi.useGetBlogContentQuery, exports.useGetBlogContentByIdQuery = exports.blogsApi.useGetBlogContentByIdQuery;
