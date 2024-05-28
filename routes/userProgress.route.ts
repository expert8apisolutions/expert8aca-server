
import express from "express";
import { isAutheticated } from "../middleware/auth";
import { getCurrentUserProgress, updateUserCompleated, updateUserProgress } from "../controllers/userProgress.controller";
const userProgressRoute = express.Router();

userProgressRoute.get("/user-progress/:courseId", isAutheticated, getCurrentUserProgress);

userProgressRoute.post("/update-user-progress/:courseId", isAutheticated, updateUserProgress);

userProgressRoute.post("/complete-user-progress/:courseId", isAutheticated, updateUserCompleated);

export default userProgressRoute;
