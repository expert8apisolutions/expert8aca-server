"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const userProgress_controller_1 = require("../controllers/userProgress.controller");
const userProgressRoute = express_1.default.Router();
userProgressRoute.get("/user-progress/:courseId", auth_1.isAutheticated, userProgress_controller_1.getCurrentUserProgress);
userProgressRoute.post("/update-user-progress/:courseId", auth_1.isAutheticated, userProgress_controller_1.updateUserProgress);
userProgressRoute.post("/complete-user-progress/:courseId", auth_1.isAutheticated, userProgress_controller_1.updateUserCompleated);
exports.default = userProgressRoute;
