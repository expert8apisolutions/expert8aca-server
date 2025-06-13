"use strict";
"use client";
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
const Heading_1 = __importDefault(require("@/app/utils/Heading"));
// import CourseContentMedia from "./CourseContentMedia";
const Header_1 = __importDefault(require("../Header"));
const Footer_1 = __importDefault(require("../Footer"));
const BlogContent = ({ slug, blog }) => {
    console.log("🚀 ~ file: BlogContent.tsx:18 ~ BlogContent ~ blog:", blog);
    // const { data: blogData, isLoading, refetch } = useGetBlogContentQuery(slug, { refetchOnMountOrArgChange: true });
    const [open, setOpen] = (0, react_1.useState)(false);
    const [route, setRoute] = (0, react_1.useState)('Login');
    const data = blog;
    const [activeVideo, setActiveVideo] = (0, react_1.useState)(0);
    return (<>
                <Header_1.default activeItem={3} open={open} setOpen={setOpen} route={route} setRoute={setRoute}/>
                <div className="w-full grid 800px:grid-cols-10">
                    <Heading_1.default title={data?.title} description={data?.description} keywords={data?.keyword}/>
                </div>
                <div className="w-full pb-[8rem]">
                <div className="max-w-[700px] mx-auto p-[20px] md:p-0 text-black">
                        <h1 className="text-[32px] pt-10 font-bold">{data?.title}</h1>
                        {/* <h1 className="text-[28px]">{data?.description}</h1> */}
                        <p dangerouslySetInnerHTML={{ __html: data.content }}></p>
                    </div>
                </div>
                <Footer_1.default />
            </>);
};
exports.default = BlogContent;
