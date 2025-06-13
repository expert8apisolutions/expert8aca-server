"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useEditLayoutMutation = exports.useGetHeroDataQuery = exports.layoutApi = void 0;
const apiSlice_1 = require("../api/apiSlice");
exports.layoutApi = apiSlice_1.apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getHeroData: builder.query({
            query: (type) => ({
                url: `get-layout/${type}`,
                method: "GET",
                credentials: "include",
            }),
        }),
        editLayout: builder.mutation({
            query: ({ type, image, title, subTitle, faq, categories, imageList }) => ({
                url: `edit-layout`,
                body: {
                    type,
                    image,
                    title,
                    subTitle,
                    faq,
                    categories,
                    imageList,
                },
                method: "PUT",
                credentials: "include",
            }),
        }),
    }),
});
exports.useGetHeroDataQuery = exports.layoutApi.useGetHeroDataQuery, exports.useEditLayoutMutation = exports.layoutApi.useEditLayoutMutation;
