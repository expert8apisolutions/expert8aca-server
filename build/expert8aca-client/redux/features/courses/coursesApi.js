"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCompleteUserProgressMutation = exports.useUpdateUserProgressMutation = exports.useGetUserProgressQuery = exports.useAddReplyInReviewMutation = exports.useAddReviewInCourseMutation = exports.useAddAnswerInQuestionMutation = exports.useAddNewQuestionMutation = exports.useGetCourseContentQuery = exports.useGetCourseDetailsQuery = exports.useGetUsersAllCoursesQuery = exports.useEditCourseMutation = exports.useDeleteCourseMutation = exports.useGetAllCoursesQuery = exports.useCreateCourseMutation = exports.coursesApi = void 0;
const apiSlice_1 = require("../api/apiSlice");
exports.coursesApi = apiSlice_1.apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createCourse: builder.mutation({
            query: (data) => ({
                url: "create-course",
                method: "POST",
                body: data,
                credentials: "include",
            }),
        }),
        getAllCourses: builder.query({
            query: () => ({
                url: "get-admin-courses",
                method: "GET",
                credentials: "include",
            }),
        }),
        deleteCourse: builder.mutation({
            query: (id) => ({
                url: `delete-course/${id}`,
                method: "DELETE",
                credentials: "include",
            }),
        }),
        editCourse: builder.mutation({
            query: ({ id, data }) => ({
                url: `edit-course/${id}`,
                method: "PUT",
                body: data,
                credentials: "include",
            }),
        }),
        getUsersAllCourses: builder.query({
            query: () => ({
                url: "get-courses",
                method: "GET",
                credentials: "include",
            }),
        }),
        getCourseDetails: builder.query({
            query: (id) => ({
                url: `get-course/${id}`,
                method: "GET",
                credentials: "include",
            }),
        }),
        getCourseContent: builder.query({
            query: (id) => ({
                url: `get-course-content/${id}`,
                method: "GET",
                credentials: "include",
            }),
        }),
        addNewQuestion: builder.mutation({
            query: ({ question, courseId, contentId }) => ({
                url: "add-question",
                body: {
                    question,
                    courseId,
                    contentId,
                },
                method: "PUT",
                credentials: "include",
            }),
        }),
        addAnswerInQuestion: builder.mutation({
            query: ({ answer, courseId, contentId, questionId }) => ({
                url: "add-answer",
                body: {
                    answer,
                    courseId,
                    contentId,
                    questionId,
                },
                method: "PUT",
                credentials: "include",
            }),
        }),
        addReviewInCourse: builder.mutation({
            query: ({ review, rating, courseId }) => ({
                url: `add-review/${courseId}`,
                body: {
                    review,
                    rating,
                },
                method: "PUT",
                credentials: "include",
            }),
        }),
        addReplyInReview: builder.mutation({
            query: ({ comment, courseId, reviewId }) => ({
                url: `add-reply`,
                body: {
                    comment, courseId, reviewId
                },
                method: "PUT",
                credentials: "include",
            }),
        }),
        getUserProgress: builder.query({
            query: (courseId) => ({
                url: `user-progress/${courseId}`,
                method: "GET",
                credentials: "include",
            }),
        }),
        updateUserProgress: builder.mutation({
            query: ({ courseId, videoId, videoTime }) => ({
                url: `update-user-progress/${courseId}`,
                body: {
                    videoId,
                    videoTime
                },
                method: "POST",
                credentials: "include",
            }),
        }),
        completeUserProgress: builder.mutation({
            query: ({ courseId, videoId }) => ({
                url: `complete-user-progress/${courseId}`,
                body: {
                    videoId
                },
                method: "POST",
                credentials: "include",
            }),
        }),
    }),
});
exports.useCreateCourseMutation = exports.coursesApi.useCreateCourseMutation, exports.useGetAllCoursesQuery = exports.coursesApi.useGetAllCoursesQuery, exports.useDeleteCourseMutation = exports.coursesApi.useDeleteCourseMutation, exports.useEditCourseMutation = exports.coursesApi.useEditCourseMutation, exports.useGetUsersAllCoursesQuery = exports.coursesApi.useGetUsersAllCoursesQuery, exports.useGetCourseDetailsQuery = exports.coursesApi.useGetCourseDetailsQuery, exports.useGetCourseContentQuery = exports.coursesApi.useGetCourseContentQuery, exports.useAddNewQuestionMutation = exports.coursesApi.useAddNewQuestionMutation, exports.useAddAnswerInQuestionMutation = exports.coursesApi.useAddAnswerInQuestionMutation, exports.useAddReviewInCourseMutation = exports.coursesApi.useAddReviewInCourseMutation, exports.useAddReplyInReviewMutation = exports.coursesApi.useAddReplyInReviewMutation, exports.useGetUserProgressQuery = exports.coursesApi.useGetUserProgressQuery, exports.useUpdateUserProgressMutation = exports.coursesApi.useUpdateUserProgressMutation, exports.useCompleteUserProgressMutation = exports.coursesApi.useCompleteUserProgressMutation;
