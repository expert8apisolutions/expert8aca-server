
import express from "express";
import { isAutheticated } from "../middleware/auth";
import { getCurrentUserProgress, getUserProgressList, updateUserCompleated, updateUserProgress, updateUserTotalWatchTime } from "../controllers/userProgress.controller";
const userProgressRoute = express.Router();

userProgressRoute.get("/user-progress/:courseId", isAutheticated, getCurrentUserProgress);

userProgressRoute.post("/update-user-progress/:courseId", isAutheticated, updateUserProgress);

userProgressRoute.post("/complete-user-progress/:courseId", isAutheticated, updateUserCompleated);

userProgressRoute.post("/update-watch-time/:courseId", isAutheticated, updateUserTotalWatchTime);

userProgressRoute.get('/user-progress-report/:courseId', getUserProgressList);

export default userProgressRoute;
