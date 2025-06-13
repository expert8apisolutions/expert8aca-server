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
const ebookApi_1 = require("@/redux/features/ebooks/ebookApi");
const EbookCard_1 = __importDefault(require("../Ebook/EbookCard"));
const Ebooks = (props) => {
    const { data, isLoading } = (0, ebookApi_1.useGetAllEbookQuery)(undefined, {});
    const [courses, setCourses] = (0, react_1.useState)([]);
    (0, react_1.useEffect)(() => {
        setCourses(data?.ebooks);
    }, [data]);
    return (<div className="bg-gradient-2">
      <div className={`w-[90%] 800px:w-[80%] m-auto pt-10`}>
        <h1 data-aos="fade-down" className="text-center font-Poppins text-[25px] leading-[35px] sm:text-3xl lg:text-4xl dark:text-white 800px:!leading-[60px] text-[#1c1c64] font-[900] tracking-tight">
        หนังสือของเรา  
        {/* <span className="text-gradient text-[32px]"></span>{" "} */}
        </h1>
        <br />
        <br />
        <div data-aos="fade-right" className="grid grid-cols-2 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] 1500px:grid-cols-4 1500px:gap-[35px] pb-12 border-0">
          {courses &&
            courses.map((item, index) => (<EbookCard_1.default item={item} key={index}/>))}
        </div>
      </div>
    </div>);
};
exports.default = Ebooks;
