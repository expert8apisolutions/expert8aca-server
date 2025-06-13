"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const blogsApi_1 = require("@/redux/features/blog/blogsApi");
const react_1 = __importDefault(require("react"));
const BlogInformation_1 = __importDefault(require("./BlogInformation"));
const BlogEdit = ({ id }) => {
    const { data: blogData, isLoading, refetch } = (0, blogsApi_1.useGetBlogContentByIdQuery)(id, { refetchOnMountOrArgChange: true });
    return <BlogInformation_1.default blogData={blogData} refetch={refetch}/>;
};
exports.default = BlogEdit;
