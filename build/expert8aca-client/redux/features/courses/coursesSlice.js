"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRespTimeWatched = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const initialState = {
    responseUpdateWatched: {},
};
const coursesSlice = (0, toolkit_1.createSlice)({
    name: "courses",
    initialState,
    reducers: {
        updateRespTimeWatched: (state, action) => {
            state.responseUpdateWatched = action.payload;
        },
    },
});
exports.updateRespTimeWatched = coursesSlice.actions.updateRespTimeWatched;
exports.default = coursesSlice.reducer;
