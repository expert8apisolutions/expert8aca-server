import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import userProgressModel from "../models/userProgress.model";
import ErrorHandler from "../utils/ErrorHandler";
import CourseModel from "../models/course.model";

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

            console.log('xxxx')

            let [userProgress, courseInfo] = await Promise.all([
                userProgressModel.findOne({
                    user_id: userId,
                    course_id: courseId,
                }),
                CourseModel.findById(courseId),
            ])

            const courseInfoVideoIds = courseInfo?.courseData.map((item) => item._id.toString());
            console.log("🚀 ~ courseInfoVideoIds:", courseInfoVideoIds)

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

                if (courseInfoVideoIds?.length && userProgress?.video_compleated_id?.length) {
                    let newVideoComplete = []
                    for (let idx = 0; idx < courseInfoVideoIds.length; idx++) {
                        const videoId = courseInfoVideoIds[idx];
                        const isVideoCompleated = userProgress.video_compleated_id.find(
                            (item) => item.video_id === videoId
                        );
                        if (isVideoCompleated) {
                            newVideoComplete.push(isVideoCompleated)
                        }
                    }

                    if (newVideoComplete.length) {
                        userProgress.video_compleated_id = newVideoComplete
                    }
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

export const updateUserTotalWatchTime = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { courseId } = req.params;
            const userId = req.user?._id || "";
            const { watchTimeInSec } = req.body;

            if (!watchTimeInSec || watchTimeInSec < 0) {
                return next(new ErrorHandler("Invalid total watch time", 400));
            }

            let userProgress = await userProgressModel.findOne({
                user_id: userId,
                course_id: courseId,
            });

            if (!userProgress) {
                userProgress = await userProgressModel.create({
                    user_id: userId,
                    course_id: courseId,
                    video_compleated_id: [],
                    current_video_id: "",
                    current_video_time: 0,
                    total_watch_time: watchTimeInSec,
                });
            } else {
                userProgress.total_watch_time += watchTimeInSec;
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

export const getUserProgressList = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { courseId } = req.params
            const userProgress = await userProgressModel.find({
                course_id: courseId,
            }).populate({
                path: 'user_id',
                select: 'name email'
              })

            res.status(200).json({
                success: true,
                results: userProgress,
            });
        } catch (error: any) {
            console.log("🚀 ~ error:", error)
            return next(new ErrorHandler(error.message, 500));
        }
    }
);
