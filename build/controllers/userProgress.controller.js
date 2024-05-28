"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserCompleated = exports.updateUserProgress = exports.getCurrentUserProgress = void 0;
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const userProgress_model_1 = __importDefault(require("../models/userProgress.model"));
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
exports.getCurrentUserProgress = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { courseId } = req.params;
        const userId = req.user?._id || "";
        const userProgress = await userProgress_model_1.default.findOne({
            user_id: userId,
            course_id: courseId,
        });
        res.status(200).json({
            success: true,
            userProgress,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.updateUserProgress = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { courseId } = req.params;
        const userId = req.user?._id || "";
        const { videoId, videoTime } = req.body;
        let userProgress = await userProgress_model_1.default.findOne({
            user_id: userId,
            course_id: courseId,
        });
        if (!userProgress) {
            userProgress = await userProgress_model_1.default.create({
                user_id: userId,
                course_id: courseId,
                video_compleated_id: [],
                current_video_id: videoId,
                current_video_time: videoTime,
            });
        }
        else {
            userProgress.current_video_id = videoId;
            userProgress.current_video_time = videoTime;
            await userProgress.save();
        }
        res.status(200).json({
            success: true,
            userProgress,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.updateUserCompleated = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { courseId } = req.params;
        const userId = req.user?._id || "";
        const { videoId } = req.body;
        let userProgress = await userProgress_model_1.default.findOne({
            user_id: userId,
            course_id: courseId,
        });
        if (!userProgress) {
            userProgress = await userProgress_model_1.default.create({
                user_id: userId,
                course_id: courseId,
                video_compleated_id: [{ video_id: videoId }],
                current_video_id: videoId,
                current_video_time: 0,
            });
        }
        else {
            const isVideoCompleated = userProgress.video_compleated_id.find((item) => item.video_id === videoId);
            if (!isVideoCompleated) {
                userProgress.video_compleated_id.push({ video_id: videoId });
            }
            await userProgress.save();
        }
        res.status(200).json({
            success: true,
            userProgress,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
