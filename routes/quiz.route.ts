import express from "express";
import { createQuiz, deleteQuiz, getAllQuiz, getQuizById, startQuiz, submitQuiz, updateQuiz } from "../controllers/quiz.controller";
import { isAutheticated } from "../middleware/auth";
const quizRouter = express.Router();

quizRouter.post("/admin/quiz", createQuiz);
quizRouter.get("/admin/quiz", getAllQuiz);
quizRouter.get("/admin/quiz/:quiz_id", getQuizById);
quizRouter.put("/admin/quiz/:quiz_id", updateQuiz);
quizRouter.delete("/admin/quiz/:quiz_id", deleteQuiz);
quizRouter.post("/quiz/:quiz_id/start", isAutheticated, startQuiz);
quizRouter.post("/quiz/:quiz_id/submit", isAutheticated, submitQuiz);


export default quizRouter;
