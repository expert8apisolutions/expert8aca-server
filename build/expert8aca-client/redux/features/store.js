"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.store = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const apiSlice_1 = require("./api/apiSlice");
const authSlice_1 = __importDefault(require("./auth/authSlice"));
const coursesSlice_1 = __importDefault(require("./courses/coursesSlice"));
exports.store = (0, toolkit_1.configureStore)({
    reducer: {
        [apiSlice_1.apiSlice.reducerPath]: apiSlice_1.apiSlice.reducer,
        auth: authSlice_1.default,
        courses: coursesSlice_1.default,
    },
    devTools: false,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice_1.apiSlice.middleware),
});
// call the load user function on every page load
const initializeApp = async () => {
    await exports.store.dispatch(apiSlice_1.apiSlice.endpoints.loadUser.initiate({}, { forceRefetch: true }));
};
initializeApp();
