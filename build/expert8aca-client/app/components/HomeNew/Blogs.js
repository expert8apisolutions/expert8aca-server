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
const react_1 = __importStar(require("react"));
const blogsApi_1 = require("@/redux/features/blog/blogsApi");
const BlogCard_1 = __importDefault(require("../Admin/Blog/BlogCard"));
const Blogs = (props) => {
    const { data, isLoading } = (0, blogsApi_1.useGetAllBlogQuery)(undefined, {});
    const [route, setRoute] = (0, react_1.useState)("Login");
    const [open, setOpen] = (0, react_1.useState)(false);
    const [blogs, setBlogs] = (0, react_1.useState)(data?.result || []);
    (0, react_1.useEffect)(() => {
        setBlogs(data?.result || []);
    }, [data]);
    return (<div className="bg-gradient-1 w-full  pb-20 font-Poppins">
            <div className={`w-[90%] 800px:w-[80%] m-auto pt-10`}>
                <h1 data-aos="fade-down" className="text-center font-Poppins text-[25px] leading-[35px] sm:text-3xl lg:text-4xl dark:text-white 800px:!leading-[60px] text-[#fff] font-[700] tracking-tight">
                ข่าวสาร/โปรโมชั่น
                    <br />
                </h1>
                <br />
                <br />
                <div data-aos="fade-right" className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] 1500px:grid-cols-4 1500px:gap-[35px] mb-12 border-0">

                    {blogs &&
            blogs.map((item, index) => (<BlogCard_1.default item={item} key={`blog-${index}`}/>))}
                </div>
            </div>
        </div>);
};
exports.default = Blogs;
