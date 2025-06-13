"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCreateOrderEbookMutation = exports.useCreateOrderMutation = exports.useVerifySlipMutation = exports.useCreatePaymentIntentMutation = exports.useGetStripePublishablekeyQuery = exports.useGetTokenPaymentEbookMutation = exports.useGetTokenPaymentMutation = exports.useGetAllOrdersQuery = exports.ordersApi = void 0;
const apiSlice_1 = require("../api/apiSlice");
exports.ordersApi = apiSlice_1.apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllOrders: builder.query({
            query: (type) => ({
                url: `get-orders`,
                method: "GET",
                credentials: "include",
            }),
        }),
        getStripePublishablekey: builder.query({
            query: () => ({
                url: `payment/stripepublishablekey`,
                method: "GET",
                credentials: "include",
            }),
        }),
        getTokenPayment: builder.mutation({
            query: (courseId) => ({
                url: `/payment/token`,
                method: "POST",
                body: {
                    courseId
                },
                credentials: "include",
            }),
        }),
        getTokenPaymentEbook: builder.mutation({
            query: (ebookId) => ({
                url: `/payment/token`,
                method: "POST",
                body: {
                    ebookId
                },
                credentials: "include",
            }),
        }),
        createPaymentIntent: builder.mutation({
            query: (amount) => ({
                url: "payment",
                method: "POST",
                body: {
                    amount,
                },
                credentials: "include",
            }),
        }),
        verifySlip: builder.mutation({
            query: (body) => ({
                url: "/verify-slip",
                method: "POST",
                body,
                credentials: "include",
            }),
        }),
        createOrder: builder.mutation({
            query: ({ courseId, payment_info }) => ({
                url: "create-order",
                body: {
                    courseId,
                    payment_info,
                },
                method: "POST",
                credentials: "include",
            }),
        }),
        createOrderEbook: builder.mutation({
            query: ({ ebookId, payment_info, isFree }) => ({
                url: "create-order-ebook",
                body: {
                    isFree,
                    ebookId,
                    payment_info,
                },
                method: "POST",
                credentials: "include",
            }),
        }),
    }),
});
exports.useGetAllOrdersQuery = exports.ordersApi.useGetAllOrdersQuery, exports.useGetTokenPaymentMutation = exports.ordersApi.useGetTokenPaymentMutation, exports.useGetTokenPaymentEbookMutation = exports.ordersApi.useGetTokenPaymentEbookMutation, exports.useGetStripePublishablekeyQuery = exports.ordersApi.useGetStripePublishablekeyQuery, exports.useCreatePaymentIntentMutation = exports.ordersApi.useCreatePaymentIntentMutation, exports.useVerifySlipMutation = exports.ordersApi.useVerifySlipMutation, exports.useCreateOrderMutation = exports.ordersApi.useCreateOrderMutation, exports.useCreateOrderEbookMutation = exports.ordersApi.useCreateOrderEbookMutation;
