"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.userLoggedOut = exports.userLoggedIn = exports.userRegistration = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const initialState = {
    token: "",
    user: "",
};
const authSlice = (0, toolkit_1.createSlice)({
    name: "auth",
    initialState,
    reducers: {
        userRegistration: (state, action) => {
            state.token = action.payload.token;
        },
        userLoggedIn: (state, action) => {
            state.token = action.payload.accessToken;
            state.user = action.payload.user;
        },
        userLoggedOut: (state) => {
            state.token = "";
            state.user = "";
        },
    },
});
_a = authSlice.actions, exports.userRegistration = _a.userRegistration, exports.userLoggedIn = _a.userLoggedIn, exports.userLoggedOut = _a.userLoggedOut;
exports.default = authSlice.reducer;
