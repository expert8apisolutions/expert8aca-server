"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const quiz_controller_1 = require("../controllers/quiz.controller");
const auth_1 = require("../middleware/auth");
const quizRouter = express_1.default.Router();
quizRouter.post("/admin/quiz", quiz_controller_1.createQuiz);
quizRouter.get("/admin/quiz", quiz_controller_1.getAllQuiz);
quizRouter.get("/admin/quiz/:quiz_id", quiz_controller_1.getQuizById);
quizRouter.put("/admin/quiz/:quiz_id", quiz_controller_1.updateQuiz);
quizRouter.delete("/admin/quiz/:quiz_id", quiz_controller_1.deleteQuiz);
quizRouter.get("/admin/quiz-report", quiz_controller_1.getQuizReport);
quizRouter.get("/quiz/:course_id/:quiz_id", auth_1.isAutheticated, quiz_controller_1.getQuizInfo);
quizRouter.post("/quiz/:quiz_id/start", auth_1.isAutheticated, quiz_controller_1.startQuiz);
quizRouter.post("/quiz/:quiz_id/submit", auth_1.isAutheticated, quiz_controller_1.submitQuiz);
quizRouter.post("/quiz/:quiz_id/status", auth_1.isAutheticated, quiz_controller_1.getQuizStatus);
exports.default = quizRouter;
