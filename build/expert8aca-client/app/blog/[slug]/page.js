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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.revalidate = exports.generateMetadata = exports.generateStaticParams = void 0;
const dynamic_1 = __importDefault(require("next/dynamic"));
const react_1 = __importDefault(require("react"));
const BlogContent = (0, dynamic_1.default)(() => Promise.resolve().then(() => __importStar(require('@/app/components/Blog/BlogContent'))), { ssr: false });
async function generateStaticParams() {
    const response = await fetch(`${process.env.SERVER_URI}/api/v1/get-all-blog`).then((res) => res.json());
    const blogs = response?.result || [];
    return blogs.map((blog) => ({
        slug: blog.slug,
    }));
}
exports.generateStaticParams = generateStaticParams;
async function generateMetadata({ params }) {
    const response = await fetch(`${process.env.SERVER_URI}/api/v1/get-blog-meta/${params.slug}`).then((res) => res.json());
    const blog = response.result;
    if (!blog) {
        return;
    }
    const publishedAt = new Date(blog.createdAt).toISOString();
    const modifiedAt = new Date(blog.updatedAt || blog.createdAt).toISOString();
    const ogImages = blog.thumbnail.url;
    return {
        title: blog.title,
        description: blog.description,
        openGraph: {
            title: blog.title,
            description: blog.description,
            // url: siteMetadata.siteUrl + blog.url,
            siteName: 'siteMetadata.title',
            locale: "en_US",
            type: "article",
            publishedTime: publishedAt,
            modifiedTime: modifiedAt,
            images: ogImages,
            // authors: authors.length > 0 ? authors : [siteMetadata.author],
        },
        twitter: {
            card: "summary_large_image",
            title: blog.title,
            description: blog.description,
            images: ogImages,
        },
    };
}
exports.generateMetadata = generateMetadata;
exports.revalidate = 120;
const Page = async ({ params }) => {
    const slug = params.slug;
    const response = await fetch(`${process.env.SERVER_URI}/api/v1/get-blog/${slug}`).then((res) => res.json());
    const blog = response.result;
    return (<>
            <BlogContent slug={slug} blog={blog}/>
        </>);
};
exports.default = Page;
