import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import userProgressModel from "../models/userProgress.model";
import ErrorHandler from "../utils/ErrorHandler";

export const getCurrentUserProgress = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { courseId } = req.params;
            const userId = req.user?._id || "";

            const userProgress = await userProgressModel.findOne({
                user_id: userId,
                course_id: courseId,
            });

            res.status(200).json({
                success: true,
                userProgress,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

export const updateUserProgress = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { courseId } = req.params;
            const userId = req.user?._id || "";
            const { videoId, videoTime } = req.body;

            let userProgress = await userProgressModel.findOne({
                user_id: userId,
                course_id: courseId,
            });

            if (!userProgress) {
                userProgress = await userProgressModel.create({
                    user_id: userId,
                    course_id: courseId,
                    video_compleated_id: [],
                    current_video_id: videoId,
                    current_video_time: videoTime,
                });
            } else {
                userProgress.current_video_id = videoId;
                userProgress.current_video_time = videoTime;
                await userProgress.save();
            }

            res.status(200).json({
                success: true,
                userProgress,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

export const updateUserCompleated = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { courseId } = req.params;
            const userId = req.user?._id || "";
            const { videoId } = req.body;

            let userProgress = await userProgressModel.findOne({
                user_id: userId,
                course_id: courseId,
            });

            if (!userProgress) {
                userProgress = await userProgressModel.create({
                    user_id: userId,
                    course_id: courseId,
                    video_compleated_id: [{ video_id: videoId }],
                    current_video_id: videoId,
                    current_video_time: 0,
                });
            } else {
                const isVideoCompleated = userProgress.video_compleated_id.find(
                    (item) => item.video_id === videoId
                );

                if (!isVideoCompleated) {
                    userProgress.video_compleated_id.push({ video_id: videoId });
                }

                await userProgress.save();
            }

            res.status(200).json({
                success: true,
                userProgress,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);