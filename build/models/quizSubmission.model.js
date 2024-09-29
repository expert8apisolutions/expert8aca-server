"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const AnswerListSchema = new mongoose_1.Schema({
    question_id: { type: String, required: true },
    answer: { type: String, required: false, default: null },
});
const TestSchema = new mongoose_1.Schema({
    score: { type: Number, required: true },
    isPassed: { type: Boolean, required: true },
    submit_date: { type: Date },
    start_date: { type: Date, required: true },
    answerList: { type: [AnswerListSchema], required: true },
});
const QuizSubmissionSchema = new mongoose_1.Schema({
    user_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    quiz_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    course_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Course', required: true },
    pre_test: { type: [TestSchema], required: true },
    post_test: { type: [TestSchema], required: true },
    pre_test_score: { type: Number, required: true },
    pre_test_passed: { type: Boolean, required: true, default: false },
    pre_test_status: { type: String, default: "NOT_START" },
    post_test_score: { type: Number, required: true },
    post_test_passed: { type: Boolean, required: true, default: false },
    post_test_status: { type: String, default: "NOT_START" },
    status: { type: String },
});
const QuizSubmissionModel = mongoose_1.default.model('Quiz_Submission', QuizSubmissionSchema);
exports.default = QuizSubmissionModel;
