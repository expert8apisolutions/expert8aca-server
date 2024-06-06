import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary";
import { createCourse, getAllCoursesService } from "../services/course.service";
import CourseModel, { IComment, ICourse } from "../models/course.model";
import { redis } from "../utils/redis";
import mongoose from "mongoose";
import path from "path";
import ejs from "ejs";
import sendMail from "../utils/sendMail";
import NotificationModel from "../models/notification.Model";
import axios from "axios";
import userModel from "../models/user.model";
import { newOrder } from "../services/order.service";
import BlogModel from "../models/blog.model";

export const createBlog = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = req.body
            const fileImg = data.fileImg;
            if (fileImg) {
              const myCloud = await cloudinary.v2.uploader.upload(fileImg, {
                folder: "blog",
              });
      
              data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
              };
            }
            
            const result = await BlogModel.create({ ...data })

            res.status(201).json({
                success: true,
                result,
            });

        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
)


export const getBlogContent = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const slug = req.params.slug;
            const result = await BlogModel.findOne({ slug })

            res.status(201).json({
                success: true,
                result,
            });

        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
)

export const getBlogContentById = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            const result = await BlogModel.findById(id)

            res.status(201).json({
                success: true,
                result,
            });

        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
)

export const getBlogMeta = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const slug = req.params.slug;
            const result = await BlogModel.findOne({ slug }).select('-content')

            res.status(201).json({
                success: true,
                result,
            });

        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
)

export const getAllBlog = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await BlogModel.find({ }).select('-content')

            res.status(201).json({
                success: true,
                result,
            });

        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
)


export const editBlog = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = req.body;
  
        const blogId = req.params.id;
  
        const blogData = await BlogModel.findById(blogId) as any;

        const fileImg = data.fileImg;
        if (fileImg) {
  
          await cloudinary.v2.uploader.destroy(blogData.thumbnail.public_id);
  
          const myCloud = await cloudinary.v2.uploader.upload(fileImg, {
            folder: "blog",
          });
  
          data.thumbnail = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          };
  
        } else {
          data.thumbnail = blogData.thumbnail
        }
  
  
        const blog = await BlogModel.findByIdAndUpdate(
          blogId,
          {
            $set: data,
          },
          { new: true }
        );
  
        res.status(201).json({
          success: true,
          blog,
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
      }
    }
  );

// upload course
export const uploadCourse = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = req.body;
            const thumbnail = data.thumbnail;
            if (thumbnail) {
                const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
                    folder: "courses",
                });

                data.thumbnail = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                };
            }
            createCourse(data, res, next);
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// edit course
export const editCourse = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = req.body;

            const thumbnail = data.thumbnail;

            const courseId = req.params.id;

            const courseData = await CourseModel.findById(courseId) as any;

            if (thumbnail && !thumbnail.startsWith("https")) {
                await cloudinary.v2.uploader.destroy(courseData.thumbnail.public_id);

                const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
                    folder: "courses",
                });

                data.thumbnail = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                };
            }

            if (thumbnail.startsWith("https")) {
                data.thumbnail = {
                    public_id: courseData?.thumbnail.public_id,
                    url: courseData?.thumbnail.url,
                };
            }

            const course = await CourseModel.findByIdAndUpdate(
                courseId,
                {
                    $set: data,
                },
                { new: true }
            );

            res.status(201).json({
                success: true,
                course,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// get single course --- without purchasing
export const getSingleCourse = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const courseId = req.params.id;

            const isCacheExist = await redis.get(courseId);

            if (isCacheExist) {
                const course = JSON.parse(isCacheExist);
                res.status(200).json({
                    success: true,
                    course,
                });
            } else {
                const course = await CourseModel.findById(req.params.id).select(
                    "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
                );

                await redis.set(courseId, JSON.stringify(course), "EX", 604800); // 7days

                res.status(200).json({
                    success: true,
                    course,
                });
            }
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// get all courses --- without purchasing
export const getAllCourses = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const courses = await CourseModel.find().select(
                "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
            );

            res.status(200).json({
                success: true,
                courses,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// get course content -- only for valid user
export const getCourseByUser = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userCourseList = req.user?.courses;
            const courseId = req.params.id;

            const courseExists = userCourseList?.find(
                (course: any) => course.courseId?.toString() === courseId
            );

            if (!courseExists) {
                return next(
                    new ErrorHandler("You are not eligible to access this course", 404)
                );
            }

            const course = await CourseModel.findById(courseId);

            const content = course?.courseData;

            res.status(200).json({
                success: true,
                content,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// add question in course
interface IAddQuestionData {
    question: string;
    courseId: string;
    contentId: string;
}

export const addQuestion = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { question, courseId, contentId }: IAddQuestionData = req.body;
            const course = await CourseModel.findById(courseId);

            if (!mongoose.Types.ObjectId.isValid(contentId)) {
                return next(new ErrorHandler("Invalid content id", 400));
            }

            const couseContent = course?.courseData?.find((item: any) =>
                item._id.equals(contentId)
            );

            if (!couseContent) {
                return next(new ErrorHandler("Invalid content id", 400));
            }

            // create a new question object
            const newQuestion: any = {
                user: req.user,
                question,
                questionReplies: [],
            };

            // add this question to our course content
            couseContent.questions.push(newQuestion);

            await NotificationModel.create({
                user: req.user?._id,
                title: "New Question Received",
                message: `You have a new question in ${couseContent.title}`,
            });

            // save the updated course
            await course?.save();

            res.status(200).json({
                success: true,
                course,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// add answer in course question
interface IAddAnswerData {
    answer: string;
    courseId: string;
    contentId: string;
    questionId: string;
}

export const addAnwser = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { answer, courseId, contentId, questionId }: IAddAnswerData =
                req.body;

            const course = await CourseModel.findById(courseId);

            if (!mongoose.Types.ObjectId.isValid(contentId)) {
                return next(new ErrorHandler("Invalid content id", 400));
            }

            const couseContent = course?.courseData?.find((item: any) =>
                item._id.equals(contentId)
            );

            if (!couseContent) {
                return next(new ErrorHandler("Invalid content id", 400));
            }

            const question = couseContent?.questions?.find((item: any) =>
                item._id.equals(questionId)
            );

            if (!question) {
                return next(new ErrorHandler("Invalid question id", 400));
            }

            // create a new answer object
            const newAnswer: any = {
                user: req.user,
                answer,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            // add this answer to our course content
            question.questionReplies.push(newAnswer);

            await course?.save();

            if (req.user?._id === question.user._id) {
                // create a notification
                await NotificationModel.create({
                    user: req.user?._id,
                    title: "New Question Reply Received",
                    message: `You have a new question reply in ${couseContent.title}`,
                });
            } else {
                const data = {
                    name: question.user.name,
                    title: couseContent.title,
                };

                const html = await ejs.renderFile(
                    path.join(__dirname, "../mails/question-reply.ejs"),
                    data
                );

                try {
                    await sendMail({
                        email: question.user.email,
                        subject: "Question Reply",
                        template: "question-reply.ejs",
                        data,
                    });
                } catch (error: any) {
                    return next(new ErrorHandler(error.message, 500));
                }
            }

            res.status(200).json({
                success: true,
                course,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// add review in course
interface IAddReviewData {
    review: string;
    rating: number;
    userId: string;
}

export const addReview = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userCourseList = req.user?.courses;

            const courseId = req.params.id;

            // check if courseId already exists in userCourseList based on _id
            const courseExists = userCourseList?.some(
                (course: any) => course.courseId?.toString() === courseId?.toString()            );

            if (!courseExists) {
                return next(
                    new ErrorHandler("You are not eligible to access this course", 404)
                );
            }

            const course = await CourseModel.findById(courseId);

            const { review, rating } = req.body as IAddReviewData;

            const reviewData: any = {
                user: req.user,
                rating,
                comment: review,
            };

            course?.reviews.push(reviewData);

            let avg = 0;

            course?.reviews.forEach((rev: any) => {
                avg += rev.rating;
            });

            if (course) {
                course.ratings = avg / course.reviews.length; // one example we have 2 reviews one is 5 another one is 4 so math working like this = 9 / 2  = 4.5 ratings
            }

            await course?.save();

            await redis.set(courseId, JSON.stringify(course), "EX", 604800); // 7days

            // create notification
            await NotificationModel.create({
                user: req.user?._id,
                title: "New Review Received",
                message: `${req.user?.name} has given a review in ${course?.name}`,
            });


            res.status(200).json({
                success: true,
                course,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// add reply in review
interface IAddReviewData {
    comment: string;
    courseId: string;
    reviewId: string;
}
export const addReplyToReview = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { comment, courseId, reviewId } = req.body as IAddReviewData;

            const course = await CourseModel.findById(courseId);

            if (!course) {
                return next(new ErrorHandler("Course not found", 404));
            }

            const review = course?.reviews?.find(
                (rev: any) => rev._id.toString() === reviewId
            );

            if (!review) {
                return next(new ErrorHandler("Review not found", 404));
            }

            const replyData: any = {
                user: req.user,
                comment,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            if (!review.commentReplies) {
                review.commentReplies = [];
            }

            review.commentReplies?.push(replyData);

            await course?.save();

            await redis.set(courseId, JSON.stringify(course), "EX", 604800); // 7days

            res.status(200).json({
                success: true,
                course,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// get all courses --- only for admin
export const getAdminAllCourses = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            getAllCoursesService(res);
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400));
        }
    }
);

// Delete Course --- only for admin
export const deleteBlog = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;

            const blog = await BlogModel.findById(id);

            if (!blog) {
                return next(new ErrorHandler("blog not found", 404));
            }

            await blog.deleteOne({ id });

            res.status(200).json({
                success: true,
                message: "blog deleted successfully",
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400));
        }
    }
);

// generate video url
export const generateVideoUrl = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { videoId } = req.body;
            const response = await axios.post(
                `https://dev.vdocipher.com/api/videos/${videoId}/otp`,
                { ttl: 300 },
                {
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Apisecret ${process.env.VDOCIPHER_API_SECRET}`,
                    },
                }
            );
            res.json(response.data);
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400));
        }
    }
);
