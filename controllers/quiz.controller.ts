import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import QuizModel from "../models/quiz.model";
import CourseModel from "../models/course.model";
import QuizSubmissionModel from "../models/quizSubmission.model";
import mongoose, { mongo } from "mongoose";

const QUIZ_STAGE = {
    NOT_STARTED: "NOT_STARTED",
    PENDING: "PENDING",
    COMPLETED: "COMPLETED",
    FAILED: "FAILED",
}

export const createQuiz = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = req.body;
            const quiz = await QuizModel.create(data);
            res.status(201).json({
                success: true,
                quiz,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

export const getAllQuiz = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const quiz = await QuizModel.aggregate([
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        description: 1,
                        pass_percentage: 1,
                        max_submission_pre_test: 1,
                        max_submission_post_test: 1,
                        quizItemCount: { $size: "$quizItem" }
                    }
                }
            ]);
            res.status(200).json({
                success: true,
                quiz,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

export const deleteQuiz = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const quiz = await QuizModel.findByIdAndDelete(req.params.quiz_id);
            if (!quiz) {
                return next(new ErrorHandler("Quiz not found", 404));
            }
            res.status(200).json({
                success: true,
                message: "Quiz deleted successfully",
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

export const getQuizById = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const quiz = await QuizModel.findById(req.params.quiz_id);
            if (!quiz) {
                return next(new ErrorHandler("Quiz not found", 404));
            }
            res.status(200).json({
                success: true,
                quiz,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

export const updateQuiz = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const quiz = await QuizModel.findByIdAndUpdate(req.params.quiz_id, req.body);
            if (!quiz) {
                return next(new ErrorHandler("Quiz not found", 404));
            }
            res.status(200).json({
                success: true,
                quiz,
            });
        }
        catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

export const startQuiz = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { course_id, type } = req.body;
            console.log("🚀 ~ type:", type)
            const userCourseList = req.user?.courses;
            const courseExists = userCourseList?.find(
                (course: any) => course?.courseId?.toString() === course_id
            );

            if (!courseExists) {
                return next(
                    new ErrorHandler("You are not eligible to access this course", 404)
                );
            }

            const course = await CourseModel.findById(course_id).select("quiz");
            if (type === "pre-test") {
                const quiz = await QuizModel.findById(course?.quiz?.preTestId).select("-quizItem.answer");
                if (!quiz) {
                    return next(new ErrorHandler("Quiz not found", 404));
                }
                const quizSubmission = await QuizSubmissionModel.findOne({
                    user_id: req.user?._id,
                    quiz_id: quiz._id,
                })

                if (quizSubmission) {
                    const isPretestPending = quizSubmission.pre_test_status === "PENDING"
                    const isPretestCompleted = quizSubmission.pre_test_status === "COMPLETED"
                    const lastPretest = quizSubmission.pre_test[quizSubmission.pre_test.length - 1]
                    if (isPretestPending) {
                        return res.status(200).json({
                            success: true,
                            quiz,
                            submissionId: lastPretest._id.toString()
                        });
                    }

                    if (isPretestCompleted && !quizSubmission.pre_test_passed) {
                        console.log("xxx1");
                        const newObjectId = new mongoose.Types.ObjectId();
                        quizSubmission.pre_test.push({
                            _id: newObjectId,
                            score: 0,
                            isPassed: false,
                            start_date: new Date(),
                            submit_date: new Date(),
                            answerList: [],
                        })
        
                        quizSubmission.pre_test_status = "PENDING";
                        quizSubmission.status = "PENDING";
        
                        await quizSubmission.save()
                        return res.status(200).json({
                            success: true,
                            quiz,
                            submissionId: newObjectId.toString()
                        });                                 
                    }else{
                        return next(new ErrorHandler("Pre-test already Passed", 400));
                    }
                } else {
                    console.log("xxx2");
                  const submission =  await QuizSubmissionModel.create({
                        user_id: req.user?._id,
                        quiz_id: quiz._id,
                        status: "PENDING",
                        pre_test: [
                            {
                                score: 0,
                                isPassed: false,
                                start_date: new Date(),
                                answerList: [],
                            }
                        ],
                        post_test: [],
                        pre_test_status: "PENDING",
                        pre_test_score: 0,
                        post_test_score: 0,
                    })
                    return res.status(200).json({
                        success: true,
                        quiz,
                        submissionId: submission.pre_test[0]._id.toString()                 
                    });
                }
            }

            if (type === "post-test") {
                const quiz = await QuizModel.findById(course?.quiz?.postTestId);
                if (!quiz) {
                    return next(new ErrorHandler("Quiz not found", 404));
                }
                res.status(200).json({
                    success: true,
                    quiz,
                });
            }

            return next(new ErrorHandler("Invalid type", 400));
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

const checkAnswer = (userAnswer: any, questionList: any) => {
    let score = 0;
    questionList.forEach((question: any, index: number) => {
        const findAnswer = userAnswer.find((answer: any) => answer.question_id === question._id?.toString());
        if (findAnswer?.answer === question.answer) {
            score += 1;
        }
    });
    return score;
}

export const submitQuiz = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { course_id, type, submissionId } = req.body;
            const userCourseList = req.user?.courses;
            const { answers } = req.body;
            console.log("🚀 ~ answers:", answers)
            const courseExists = userCourseList?.find(
                (course: any) => course?.courseId?.toString() === course_id
            );

            if (!courseExists) {
                return next(
                    new ErrorHandler("You are not eligible to access this course", 404)
                );
            }

            const course = await CourseModel.findById(course_id).select("quiz");
            if (type === "pre-test") {
                const quiz = await QuizModel.findById(course?.quiz?.preTestId)
                if (!quiz) {
                    return next(new ErrorHandler("Quiz not found", 404));
                }

                const score = checkAnswer(answers, quiz.quizItem)

                const quizSubmission = await QuizSubmissionModel.findOne({
                    user_id: req.user?._id,
                    quiz_id: quiz._id,
                });

                if (!quizSubmission) {
                    return next(new ErrorHandler("Quiz submission not found", 404));
                }

                const amountItemPassFromPercent = Math.floor((quiz.pass_percentage / 100) * quiz.quizItem.length)
                const amountUserPercent = Math.floor((score / quiz.quizItem.length) * 100)
                const isPass = score >= amountItemPassFromPercent
                const indexPretest = quizSubmission.pre_test.findIndex((item: any) => item._id.toString() === submissionId)
                const currentPretest = quizSubmission.pre_test[indexPretest]
                console.log("🚀 ~ currentPretest:", currentPretest)

                quizSubmission.pre_test[indexPretest] = {
                    ...currentPretest,
                    start_date: currentPretest.start_date,
                    score,
                    isPassed: isPass,
                    submit_date: new Date(),
                    answerList: answers,
                }

                quizSubmission.pre_test_score = score;
                quizSubmission.pre_test_passed = isPass;
                quizSubmission.pre_test_status = "COMPLETED";
                quizSubmission.status = "PENDING";

                const result = await quizSubmission.save()

                res.status(200).json({
                    success: true,
                    result: {
                        score,
                        total: quiz.quizItem.length,
                        isPass: isPass,
                        userPercentage: amountUserPercent,
                        result: result
                    },
                });
            }

            if (type === "post-test") {
                const quiz = await QuizModel.findById(course?.quiz?.postTestId);
                if (!quiz) {
                    return next(new ErrorHandler("Quiz not found", 404));
                }
                res.status(200).json({
                    success: true,
                    quiz,
                });
            }
        } catch (error: any) {
            console.log("🚀 ~ error:", error)
            return next(new ErrorHandler(error.message, 500));
        }
    }
);


export const getQuizStatus = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { course_id, type } = req.body;
            const userCourseList = req.user?.courses;
            const { answers } = req.body;
            const courseExists = userCourseList?.find(
                (course: any) => course?.courseId?.toString() === course_id
            );

            if (!courseExists) {
                return next(
                    new ErrorHandler("You are not eligible to access this course", 404)
                );
            }

            const course = await CourseModel.findById(course_id).select("quiz");
            if (type === "pre-test") {
                const quiz = await QuizModel.findById(course?.quiz?.preTestId).select("-quizItem.answer");
                if (!quiz) {
                    return next(new ErrorHandler("Quiz not found", 404));
                }

                const quizSubmission = await QuizSubmissionModel.findOne({
                    user_id: req.user?._id,
                    quiz_id: quiz._id,
                });

                if (!quizSubmission) {
                    return res.status(200).json({
                        success: true,
                        result: {
                            stage: QUIZ_STAGE.NOT_STARTED
                        }
                    });
                }

                if (quizSubmission.pre_test_status === "PENDING") {
                    const lastPretest = quizSubmission.pre_test[quizSubmission.pre_test.length - 1]

                    return res.status(200).json({
                        success: true,
                        result: {
                            stage: QUIZ_STAGE.PENDING,
                            quiz,
                            submissionId: lastPretest._id.toString()
                        }
                    });
                }

                if (quizSubmission.pre_test_status === "COMPLETED") {
                    return res.status(200).json({
                        success: true,
                        result: {
                            stage: QUIZ_STAGE.COMPLETED,
                            quiz,
                            quizSubmission,
                        }
                    });
                }
            }

            if (type === "post-test") {
                const quiz = await QuizModel.findById(course?.quiz?.postTestId);
                if (!quiz) {
                    return next(new ErrorHandler("Quiz not found", 404));
                }
                res.status(200).json({
                    success: true,
                    quiz,
                });
            }
        } catch (error: any) {
            console.log("🚀 ~ error:", error)
            return next(new ErrorHandler(error.message, 500));
        }
    }
);
