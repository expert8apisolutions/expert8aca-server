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
const image_1 = __importDefault(require("next/image"));
const fa6_1 = require("react-icons/fa6");
const imageList = [
    {
        url: '/ourservice/new1.png'
    },
    {
        url: '/ourservice/new2.png'
    },
    {
        url: '/ourservice/111.png'
    },
    {
        url: '/ourservice/new3.png'
    },
    {
        url: '/ourservice/333.png'
    },
    {
        url: '/ourservice/4444.png'
    },
    {
        url: '/ourservice/5.jpeg'
    },
    {
        url: '/ourservice/1212.png'
    },
];
const OurService = (props) => {
    const { data, isLoading } = (0, blogsApi_1.useGetAllBlogQuery)(undefined, {});
    const [route, setRoute] = (0, react_1.useState)("Login");
    const [open, setOpen] = (0, react_1.useState)(false);
    const [blogs, setBlogs] = (0, react_1.useState)(data?.result || []);
    (0, react_1.useEffect)(() => {
        setBlogs(data?.result || []);
    }, [data]);
    return (<div className="bg-[#f5f7e563]">
            <div className={`w-[90%] 800px:w-[80%] m-auto pt-10 flex justify-center flex-col items-center pb-12`}>
                <h1 data-aos="fade-down" className="text-center font-Poppins text-[25px] leading-[35px] sm:text-3xl lg:text-4xl dark:text-white 800px:!leading-[60px] text-[#000] font-[700] tracking-tight">
                    <span className="text-gradient">บริการของเรา</span>{" "}
                    <br />
                </h1>
                <br />
                <br />
                <div data-aos="fade-right" className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] 1500px:grid-cols-4 1500px:gap-[35px] pb-12 border-0">
                    {imageList.map(ele => {
            return <image_1.default className="box-shadow-grow " src={ele.url} alt="" height={512} width={432}/>;
        })}

                </div>
                <div onClick={() => { window.open('https://lin.ee/yt88ntk'); }} data-aos="fade-up" data-aos-delay="500" className="font-Poppins box-shadow-grow flex items-center justify-center h-[40px] w-[150px] md:h-[60px] md:w-[200px] font-size-[12px]  md:font-size-[16px] text-[16px] font-bold leading-[56px] fill-[#FFFFFF] text-[#ffff] bg-[#03c755] hover:bg-[#4cc703] md:text-[24px] cursor-pointer border-solid border-[2px_2px_2px_2px] border-[#ffcf66] rounded-lg px-[20px] md:px-[10px] py-0">
                    <fa6_1.FaLine />
                    <span className="ml-2">
                        ติดต่อเรา
                    </span>
                </div>
            </div>
        </div>);
};
exports.default = OurService;
