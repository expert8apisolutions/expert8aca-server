"use strict";
'use client';
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
const layoutApi_1 = require("@/redux/features/layout/layoutApi");
const image_1 = __importDefault(require("next/image"));
const link_1 = __importDefault(require("next/link"));
const react_1 = __importStar(require("react"));
const bi_1 = require("react-icons/bi");
const Loader_1 = __importDefault(require("../Loader/Loader"));
const navigation_1 = require("next/navigation");
const Hero = (props) => {
    const { data, isLoading } = (0, layoutApi_1.useGetHeroDataQuery)("Banner", {});
    const [search, setSearch] = (0, react_1.useState)("");
    const router = (0, navigation_1.useRouter)();
    const handleSearch = () => {
        if (search === "") {
            return;
        }
        else {
            router.push(`/courses?title=${search}`);
        }
    };
    return (<>
   {isLoading ? (<Loader_1.default />) : (<div className="w-full 1000px:flex items-center">
      <div className="absolute top-[100px] 1000px:top-[unset] 1500px:h-[700px] 1500px:w-[700px] 1100px:h-[600px] 1100px:w-[600px] h-[40vh] left-5 w-[40vh] hero_animation rounded-[50%] 1100px:left-8 1500px:left-14"></div>
      <div className="1000px:w-[40%] flex 1000px:min-h-screen items-center justify-end pt-[70px] 1000px:pt-[0] z-10">
        <image_1.default src={data?.layout?.banner?.image?.url} width={400} height={400} alt="" className="object-contain 1100px:max-w-[90%] w-[90%] 1500px:max-w-[85%] h-[auto] z-[10]"/>
      </div>
      <div className="1000px:w-[60%] flex flex-col items-center 1000px:mt-[0px] text-center 1000px:text-left mt-[30px]">
        <h2 className="dark:text-white text-[#000000c7] text-[30px] px-3 w-full 1000px:text-[70px] font-[600] font-Josefin py-2 1000px:leading-[75px] 1500px:w-[60%] 1100px:w-[78%]">
          {data?.layout?.banner?.title}
        </h2>
        <br />
        <p className="dark:text-[#edfff4] text-[#000000ac] font-Josefin font-[600] text-[18px] 1500px:!w-[55%] 1100px:!w-[78%]">
         {data?.layout?.banner?.subTitle}
        </p>
        <br />
        <br />
        <div className="1500px:w-[55%] 1100px:w-[78%] w-[90%] h-[50px] bg-transparent relative">
          <input type="search" placeholder="Search Courses..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-transparent border dark:border-none dark:bg-[#575757] dark:placeholder:text-[#ffffffdd] rounded-[5px] p-2 w-full h-full outline-none text-[#0000004e] dark:text-[#ffffffe6] text-[20px] font-[500] font-Josefin"/>
          <div className="absolute flex items-center justify-center w-[50px] cursor-pointer h-[50px] right-0 top-0 bg-[#39c1f3] rounded-r-[5px]" onClick={handleSearch}>
            <bi_1.BiSearch className="text-white" size={30}/>
          </div>
        </div>
        <br />
        <br />
        <div className="1500px:w-[55%] 1100px:w-[78%] w-[90%] flex items-center">
          <image_1.default src={require("../../../public/assests/client-1.jpg")} alt="" className="rounded-full"/>
          <image_1.default src={require("../../../public/assests/client-2.jpg")} alt="" className="rounded-full ml-[-20px]"/>
          <image_1.default src={require("../../../public/assests/client-3.jpg")} alt="" className="rounded-full ml-[-20px]"/>
          <p className="font-Josefin dark:text-[#edfff4] text-[#000000b3] 1000px:pl-3 text-[18px] font-[600]">
            500K+ People already trusted us.{" "}
            <link_1.default href="/courses" className="dark:text-[#46e256] text-[crimson]">
              View Courses
            </link_1.default>{" "}
          </p>
        </div>
        <br />
      </div>
    </div>)}
   </>);
};
exports.default = Hero;
