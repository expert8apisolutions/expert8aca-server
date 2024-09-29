"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserProgressList = exports.updateUserTotalWatchTime = exports.updateUserCompleated = exports.updateUserProgress = exports.getCurrentUserProgress = void 0;
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const userProgress_model_1 = __importDefault(require("../models/userProgress.model"));
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const course_model_1 = __importDefault(require("../models/course.model"));
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
        console.log('xxxx');
        let [userProgress, courseInfo] = await Promise.all([
            userProgress_model_1.default.findOne({
                user_id: userId,
                course_id: courseId,
            }),
            course_model_1.default.findById(courseId),
        ]);
        const courseInfoVideoIds = courseInfo?.courseData.map((item) => item._id.toString());
        console.log("🚀 ~ courseInfoVideoIds:", courseInfoVideoIds);
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
            if (courseInfoVideoIds?.length && userProgress?.video_compleated_id?.length) {
                let newVideoComplete = [];
                for (let idx = 0; idx < courseInfoVideoIds.length; idx++) {
                    const videoId = courseInfoVideoIds[idx];
                    const isVideoCompleated = userProgress.video_compleated_id.find((item) => item.video_id === videoId);
                    if (isVideoCompleated) {
                        newVideoComplete.push(isVideoCompleated);
                    }
                }
                if (newVideoComplete.length) {
                    userProgress.video_compleated_id = newVideoComplete;
                }
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
exports.updateUserTotalWatchTime = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { courseId } = req.params;
        const userId = req.user?._id || "";
        const { watchTimeInSec } = req.body;
        if (!watchTimeInSec || watchTimeInSec < 0) {
            return next(new ErrorHandler_1.default("Invalid total watch time", 400));
        }
        let userProgress = await userProgress_model_1.default.findOne({
            user_id: userId,
            course_id: courseId,
        });
        if (!userProgress) {
            userProgress = await userProgress_model_1.default.create({
                user_id: userId,
                course_id: courseId,
                video_compleated_id: [],
                current_video_id: "",
                current_video_time: 0,
                total_watch_time: watchTimeInSec,
            });
        }
        else {
            userProgress.total_watch_time += watchTimeInSec;
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
exports.getUserProgressList = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { courseId } = req.params;
        const userProgress = await userProgress_model_1.default.find({
            course_id: courseId,
        }).populate({
            path: 'user_id',
            select: 'name email'
        });
        res.status(200).json({
            success: true,
            results: userProgress,
        });
    }
    catch (error) {
        console.log("🚀 ~ error:", error);
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
