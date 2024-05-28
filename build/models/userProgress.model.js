"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userProgressSchema = new mongoose_1.default.Schema({
    user_id: {
        type: String,
        required: true,
    },
    course_id: {
        type: String,
        required: true,
    },
    video_compleated_id: [
        {
            video_id: String,
        },
    ],
    current_video_id: {
        type: String,
        required: true,
    },
    current_video_time: {
        type: Number,
        required: true,
    },
}, { timestamps: true });
const userProgressModel = mongoose_1.default.model("User_progress", userProgressSchema);
exports.default = userProgressModel;
