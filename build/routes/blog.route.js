"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const blog_controller_1 = require("../controllers/blog.controller");
const blogRouter = express_1.default.Router();
blogRouter.post("/create-blog", auth_1.isAutheticated, (0, auth_1.authorizeRoles)("admin"), blog_controller_1.createBlog);
blogRouter.put("/edit-blog/:id", auth_1.isAutheticated, (0, auth_1.authorizeRoles)("admin"), blog_controller_1.editBlog);
blogRouter.get("/get-blog/:slug", blog_controller_1.getBlogContent);
blogRouter.get("/get-blog-byid/:id", blog_controller_1.getBlogContentById);
blogRouter.get("/get-blog-meta/:slug", blog_controller_1.getBlogMeta);
blogRouter.get("/get-all-blog", blog_controller_1.getAllBlog);
blogRouter.delete("/delete-blog/:id", auth_1.isAutheticated, (0, auth_1.authorizeRoles)("admin"), blog_controller_1.deleteBlog);
exports.default = blogRouter;
