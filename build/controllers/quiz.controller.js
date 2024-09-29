"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQuizInfo = exports.getQuizReportByDate = exports.getQuizReport = exports.getQuizStatus = exports.submitQuiz = exports.startQuiz = exports.updateQuiz = exports.getQuizById = exports.deleteQuiz = exports.getAllQuiz = exports.createQuiz = void 0;
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const quiz_model_1 = __importDefault(require("../models/quiz.model"));
const course_model_1 = __importDefault(require("../models/course.model"));
const quizSubmission_model_1 = __importDefault(require("../models/quizSubmission.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const QUIZ_STAGE = {
    NOT_START: "NOT_START",
    PENDING: "PENDING",
    COMPLETED: "COMPLETED",
    FAILED: "FAILED",
};
exports.createQuiz = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const data = req.body;
        const quiz = await quiz_model_1.default.create({ ...data, total_questions: data.quizItem.length });
        res.status(201).json({
            success: true,
            quiz,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.getAllQuiz = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const quiz = await quiz_model_1.default.aggregate([
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
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.deleteQuiz = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const quiz = await quiz_model_1.default.findByIdAndDelete(req.params.quiz_id);
        if (!quiz) {
            return next(new ErrorHandler_1.default("Quiz not found", 404));
        }
        res.status(200).json({
            success: true,
            message: "Quiz deleted successfully",
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.getQuizById = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const quiz = await quiz_model_1.default.findById(req.params.quiz_id);
        if (!quiz) {
            return next(new ErrorHandler_1.default("Quiz not found", 404));
        }
        res.status(200).json({
            success: true,
            quiz,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.updateQuiz = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const quiz = await quiz_model_1.default.findByIdAndUpdate(req.params.quiz_id, { ...req.body, total_questions: req.body.quizItem.length });
        if (!quiz) {
            return next(new ErrorHandler_1.default("Quiz not found", 404));
        }
        res.status(200).json({
            success: true,
            quiz,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.startQuiz = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { course_id, type } = req.body;
        const userCourseList = req.user?.courses;
        const courseExists = userCourseList?.find((course) => course?.courseId?.toString() === course_id);
        if (!courseExists) {
            return next(new ErrorHandler_1.default("You are not eligible to access this course", 404));
        }
        const course = await course_model_1.default.findById(course_id).select("quiz");
        if (type === "pre-test") {
            const quiz = await quiz_model_1.default.findById(course?.quiz?.preTestId).select("-quizItem.answer");
            if (!quiz) {
                return next(new ErrorHandler_1.default("Quiz not found", 404));
            }
            const quizSubmission = await quizSubmission_model_1.default.findOne({
                user_id: req.user?._id,
                quiz_id: quiz._id,
                course_id: course?._id,
            });
            if (quizSubmission) {
                const isPretestPending = quizSubmission.pre_test_status === "PENDING";
                const isPretestCompleted = quizSubmission.pre_test_status === "COMPLETED";
                const isPretestNotStart = quizSubmission.pre_test_status === "NOT_START";
                const lastPretest = quizSubmission.pre_test[quizSubmission.pre_test.length - 1];
                if (isPretestNotStart) {
                    quizSubmission.pre_test_status = "PENDING";
                    quizSubmission.status = "PENDING";
                    const newObjectId = new mongoose_1.default.Types.ObjectId();
                    const resultStart = await quizSubmission_model_1.default.findOneAndUpdate({
                        user_id: req.user?._id,
                        quiz_id: quiz._id,
                        course_id: course?._id,
                    }, {
                        pre_test: [
                            {
                                _id: newObjectId,
                                score: 0,
                                isPassed: false,
                                start_date: new Date(),
                                answerList: [],
                            }
                        ],
                        pre_test_status: "PENDING",
                        pre_test_score: 0,
                    });
                    return res.status(200).json({
                        success: true,
                        quiz,
                        submissionId: newObjectId.toString(),
                        quizSubmission: resultStart,
                    });
                }
                if (isPretestPending) {
                    return res.status(200).json({
                        success: true,
                        quiz,
                        submissionId: lastPretest._id.toString(),
                        quizSubmission,
                    });
                }
                if (isPretestCompleted && !quizSubmission.pre_test_passed) {
                    const newObjectId = new mongoose_1.default.Types.ObjectId();
                    quizSubmission.pre_test.push({
                        _id: newObjectId,
                        score: 0,
                        isPassed: false,
                        start_date: new Date(),
                        submit_date: new Date(),
                        answerList: [],
                    });
                    quizSubmission.pre_test_status = "PENDING";
                    quizSubmission.status = "PENDING";
                    await quizSubmission.save();
                    return res.status(200).json({
                        success: true,
                        quiz,
                        submissionId: newObjectId.toString(),
                        quizSubmission,
                    });
                }
                else {
                    return next(new ErrorHandler_1.default("Pre-test already Passed", 400));
                }
            }
            else {
                const quizSubmission = await quizSubmission_model_1.default.create({
                    user_id: req.user?._id,
                    quiz_id: quiz._id,
                    course_id: course?._id,
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
                });
                return res.status(200).json({
                    success: true,
                    quiz,
                    submissionId: quizSubmission.pre_test[0]._id.toString(),
                    quizSubmission,
                });
            }
        }
        if (type === "post-test") {
            const quiz = await quiz_model_1.default.findById(course?.quiz?.postTestId).select("-quizItem.answer");
            console.log("🚀 ~ quiz:", quiz);
            if (!quiz) {
                return next(new ErrorHandler_1.default("Quiz not found", 404));
            }
            const quizSubmission = await quizSubmission_model_1.default.findOne({
                user_id: req.user?._id,
                quiz_id: quiz._id,
                course_id: course?._id,
            });
            if (quizSubmission) {
                const isPosttestPending = quizSubmission.post_test_status === "PENDING";
                const isPosttestCompleted = quizSubmission.post_test_status === "COMPLETED";
                const isPosttestNotStart = quizSubmission.post_test_status === "NOT_START";
                const lastPtest = quizSubmission.post_test[quizSubmission.post_test.length - 1];
                if (isPosttestNotStart) {
                    quizSubmission.post_test_status = "PENDING";
                    quizSubmission.status = "PENDING";
                    const newObjectId = new mongoose_1.default.Types.ObjectId();
                    const resultStart = await quizSubmission_model_1.default.findOneAndUpdate({
                        user_id: req.user?._id,
                        quiz_id: quiz._id,
                        course_id: course?._id,
                    }, {
                        post_test: [
                            {
                                _id: newObjectId,
                                score: 0,
                                isPassed: false,
                                start_date: new Date(),
                                answerList: [],
                            }
                        ],
                        post_test_status: "PENDING",
                        post_test_score: 0,
                    });
                    console.log("🚀 ~ resultStart:", resultStart);
                    return res.status(200).json({
                        success: true,
                        quiz,
                        submissionId: newObjectId.toString(),
                        quizSubmission: resultStart,
                    });
                }
                if (isPosttestPending) {
                    return res.status(200).json({
                        success: true,
                        quiz,
                        submissionId: lastPtest._id.toString(),
                        quizSubmission,
                    });
                }
                if (isPosttestCompleted && !quizSubmission.post_test_passed) {
                    const newObjectId = new mongoose_1.default.Types.ObjectId();
                    quizSubmission.post_test.push({
                        _id: newObjectId,
                        score: 0,
                        isPassed: false,
                        start_date: new Date(),
                        submit_date: new Date(),
                        answerList: [],
                    });
                    quizSubmission.post_test_status = "PENDING";
                    quizSubmission.status = "PENDING";
                    await quizSubmission.save();
                    return res.status(200).json({
                        success: true,
                        quiz,
                        submissionId: newObjectId.toString(),
                        quizSubmission,
                    });
                }
                else {
                    return next(new ErrorHandler_1.default("Post-test already Passed", 400));
                }
            }
            else {
                const quizSubmission = await quizSubmission_model_1.default.create({
                    user_id: req.user?._id,
                    quiz_id: quiz._id,
                    course_id: course?._id,
                    status: "PENDING",
                    post_test: [
                        {
                            score: 0,
                            isPassed: false,
                            start_date: new Date(),
                            answerList: [],
                        }
                    ],
                    pre_test: [],
                    post_test_status: "PENDING",
                    post_test_score: 0,
                    pre_test_score: 0,
                });
                return res.status(200).json({
                    success: true,
                    quiz,
                    submissionId: quizSubmission.post_test[0]._id.toString(),
                    quizSubmission,
                });
            }
        }
        return next(new ErrorHandler_1.default("Invalid type", 400));
    }
    catch (error) {
        console.log("🚀 ~ error:", error);
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
const checkAnswer = (userAnswer, questionList) => {
    let score = 0;
    questionList.forEach((question, index) => {
        const findAnswer = userAnswer.find((answer) => answer.question_id === question._id?.toString());
        if (findAnswer?.answer === question.answer) {
            score += 1;
        }
    });
    return score;
};
exports.submitQuiz = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { course_id, type, submissionId } = req.body;
        const userCourseList = req.user?.courses;
        const { answers } = req.body;
        const courseExists = userCourseList?.find((course) => course?.courseId?.toString() === course_id);
        if (!courseExists) {
            return next(new ErrorHandler_1.default("You are not eligible to access this course", 404));
        }
        const course = await course_model_1.default.findById(course_id).select("quiz");
        if (type === "pre-test") {
            const quiz = await quiz_model_1.default.findById(course?.quiz?.preTestId);
            if (!quiz) {
                return next(new ErrorHandler_1.default("Quiz not found", 404));
            }
            const score = checkAnswer(answers, quiz.quizItem);
            const quizSubmission = await quizSubmission_model_1.default.findOne({
                user_id: req.user?._id,
                quiz_id: quiz._id,
                course_id: course?._id,
            });
            if (!quizSubmission) {
                return next(new ErrorHandler_1.default("Quiz submission not found", 404));
            }
            const amountItemPassFromPercent = Math.floor((quiz.pass_percentage / 100) * quiz.quizItem.length);
            const amountUserPercent = Math.floor((score / quiz.quizItem.length) * 100);
            const isPass = score >= amountItemPassFromPercent;
            const indexPretest = quizSubmission.pre_test.findIndex((item) => item._id.toString() === submissionId);
            const currentPretest = quizSubmission.pre_test[indexPretest];
            quizSubmission.pre_test[indexPretest] = {
                ...currentPretest,
                start_date: currentPretest.start_date,
                score,
                isPassed: isPass,
                submit_date: new Date(),
                answerList: answers,
            };
            quizSubmission.pre_test_score = score;
            quizSubmission.pre_test_passed = isPass;
            quizSubmission.pre_test_status = "COMPLETED";
            quizSubmission.status = "PENDING";
            const result = await quizSubmission.save();
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
            const quiz = await quiz_model_1.default.findById(course?.quiz?.preTestId);
            if (!quiz) {
                return next(new ErrorHandler_1.default("Quiz not found", 404));
            }
            const score = checkAnswer(answers, quiz.quizItem);
            const quizSubmission = await quizSubmission_model_1.default.findOne({
                user_id: req.user?._id,
                quiz_id: quiz._id,
                course_id: course?._id,
            });
            if (!quizSubmission) {
                return next(new ErrorHandler_1.default("Quiz submission not found", 404));
            }
            const amountItemPassFromPercent = Math.floor((quiz.pass_percentage / 100) * quiz.quizItem.length);
            const amountUserPercent = Math.floor((score / quiz.quizItem.length) * 100);
            const isPass = score >= amountItemPassFromPercent;
            const indexPosttest = quizSubmission.post_test.findIndex((item) => item._id.toString() === submissionId);
            const currentPretest = quizSubmission.post_test[indexPosttest];
            quizSubmission.post_test[indexPosttest] = {
                ...currentPretest,
                start_date: currentPretest.start_date,
                score,
                isPassed: isPass,
                submit_date: new Date(),
                answerList: answers,
            };
            quizSubmission.post_test_score = score;
            quizSubmission.post_test_passed = isPass;
            quizSubmission.post_test_status = "COMPLETED";
            quizSubmission.status = "PENDING";
            const result = await quizSubmission.save();
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
    }
    catch (error) {
        console.log("🚀 ~ error:", error);
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.getQuizStatus = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { course_id, type } = req.body;
        const userCourseList = req.user?.courses;
        const { answers } = req.body;
        const courseExists = userCourseList?.find((course) => course?.courseId?.toString() === course_id);
        if (!courseExists) {
            return next(new ErrorHandler_1.default("You are not eligible to access this course", 404));
        }
        const course = await course_model_1.default.findById(course_id).select("quiz");
        if (type === "pre-test") {
            const quiz = await quiz_model_1.default.findById(course?.quiz?.preTestId).select("-quizItem.answer");
            if (!quiz) {
                return next(new ErrorHandler_1.default("Quiz not found", 404));
            }
            const quizSubmission = await quizSubmission_model_1.default.findOne({
                user_id: req.user?._id,
                quiz_id: quiz._id,
                course_id: course?._id,
            });
            if (!quizSubmission) {
                return res.status(200).json({
                    success: true,
                    result: {
                        stage: QUIZ_STAGE.NOT_START,
                        quiz,
                    }
                });
            }
            if (quizSubmission.pre_test_status === "PENDING") {
                const lastPretest = quizSubmission.pre_test[quizSubmission.pre_test.length - 1];
                return res.status(200).json({
                    success: true,
                    result: {
                        stage: QUIZ_STAGE.PENDING,
                        quiz,
                        submissionId: lastPretest._id.toString(),
                        quizSubmission,
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
            if (quizSubmission.pre_test_status === "NOT_START") {
                return res.status(200).json({
                    success: true,
                    result: {
                        stage: QUIZ_STAGE.NOT_START,
                        quiz,
                        quizSubmission,
                    }
                });
            }
        }
        if (type === "post-test") {
            const quiz = await quiz_model_1.default.findById(course?.quiz?.preTestId).select("-quizItem.answer");
            console.log("🚀 ~ quiz:", quiz);
            if (!quiz) {
                return next(new ErrorHandler_1.default("Quiz not found", 404));
            }
            const quizSubmission = await quizSubmission_model_1.default.findOne({
                user_id: req.user?._id,
                quiz_id: quiz._id,
                course_id: course?._id,
            });
            console.log("🚀 ~ quizSubmission:", quizSubmission);
            if (!quizSubmission) {
                return res.status(200).json({
                    success: true,
                    result: {
                        stage: QUIZ_STAGE.NOT_START,
                        quiz,
                    }
                });
            }
            if (quizSubmission.post_test_status === "PENDING") {
                const lastPosttest = quizSubmission.post_test[quizSubmission.post_test.length - 1];
                return res.status(200).json({
                    success: true,
                    result: {
                        stage: QUIZ_STAGE.PENDING,
                        quiz,
                        submissionId: lastPosttest._id.toString(),
                        quizSubmission,
                    }
                });
            }
            if (quizSubmission.post_test_status === "COMPLETED") {
                return res.status(200).json({
                    success: true,
                    result: {
                        stage: QUIZ_STAGE.COMPLETED,
                        quiz,
                        quizSubmission,
                    }
                });
            }
            if (quizSubmission.post_test_status === "NOT_START") {
                return res.status(200).json({
                    success: true,
                    result: {
                        stage: QUIZ_STAGE.NOT_START,
                        quiz,
                        quizSubmission,
                    }
                });
            }
        }
    }
    catch (error) {
        console.log("🚀 ~ error:", error);
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.getQuizReport = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { quiz_id } = req.query;
        const quiz = await quizSubmission_model_1.default.aggregate([
            {
                $match: {
                    quiz_id: new mongoose_1.default.Types.ObjectId(quiz_id)
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $lookup: {
                    from: "quizzes",
                    localField: "quiz_id",
                    foreignField: "_id",
                    as: "quiz"
                }
            },
            {
                $lookup: {
                    from: "courses",
                    localField: "course_id",
                    foreignField: "_id",
                    as: "course"
                }
            },
            {
                $project: {
                    _id: 1,
                    "user.name": 1,
                    pre_test_score: 1,
                    post_test_score: 1,
                    pre_test_passed: 1,
                    post_test_passed: 1,
                    pre_test_status: 1,
                    post_test_status: 1,
                    status: 1,
                    pre_test_count: { $size: "$pre_test" },
                    post_test_count: { $size: "$post_test" },
                    pre_test_last_submit_date: { $last: "$pre_test.submit_date" },
                    post_test_last_submit_date: { $last: "$post_test.submit_date" },
                }
            },
        ]);
        // {
        //     $match: {
        //         $or: [
        //             { pre_test_last_submit_date: { $gte: new Date("2022-01-01"), $lte: new Date("2022-12-31") } },
        //             { post_test_last_submit_date: { $gte: new Date("2022-01-01"), $lte: new Date("2022-12-31") } }
        //         ]
        //     }
        // }
        res.status(200).json({
            success: true,
            result: quiz,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.getQuizReportByDate = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { quiz_id, start_date, end_date } = req.query;
        const quiz = await quizSubmission_model_1.default.aggregate([
            {
                $match: {
                    quiz_id: new mongoose_1.default.Types.ObjectId(quiz_id)
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $lookup: {
                    from: "quizzes",
                    localField: "quiz_id",
                    foreignField: "_id",
                    as: "quiz"
                }
            },
            {
                $lookup: {
                    from: "courses",
                    localField: "course_id",
                    foreignField: "_id",
                    as: "course"
                }
            },
            {
                $project: {
                    _id: 1,
                    "user.name": 1,
                    pre_test_score: 1,
                    post_test_score: 1,
                    pre_test_passed: 1,
                    post_test_passed: 1,
                    pre_test_status: 1,
                    post_test_status: 1,
                    status: 1,
                    pre_test_count: { $size: "$pre_test" },
                    post_test_count: { $size: "$post_test" },
                    pre_test_last_submit_date: { $last: "$pre_test.submit_date" },
                    post_test_last_submit_date: { $last: "$post_test.submit_date" },
                }
            },
            {
                $match: {
                    $or: [
                        { pre_test_last_submit_date: { $gte: new Date(start_date), $lte: new Date(end_date) } },
                        { post_test_last_submit_date: { $gte: new Date(start_date), $lte: new Date(end_date) } }
                    ]
                }
            }
        ]);
        res.status(200).json({
            success: true,
            result: quiz,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.getQuizInfo = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { quiz_id, course_id } = req.params;
        if (!quiz_id || !course_id) {
            return next(new ErrorHandler_1.default("Invalid quiz_id or course_id", 400));
        }
        const quiz = await quizSubmission_model_1.default.findOne({
            quiz_id: new mongoose_1.default.Types.ObjectId(quiz_id),
            user_id: new mongoose_1.default.Types.ObjectId(req.user?._id),
            course_id: new mongoose_1.default.Types.ObjectId(course_id),
        }).select("pre_test_passed post_test_passed");
        res.status(200).json({
            success: true,
            result: quiz,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
