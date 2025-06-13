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
const Header_1 = __importDefault(require("../../components/Header"));
const Footer_1 = __importDefault(require("../../components/Footer"));
const aos_1 = __importDefault(require("aos"));
require("slick-carousel/slick/slick.css");
require("slick-carousel/slick/slick-theme.css");
require("aos/dist/aos.css");
const PeopleReview_1 = __importDefault(require("./PeopleReview"));
const WhyLearnCourse_1 = __importDefault(require("./WhyLearnCourse"));
const Course_1 = __importDefault(require("./Course"));
const Ebooks_1 = __importDefault(require("./Ebooks"));
const FAQ_1 = __importDefault(require("../FAQ/FAQ"));
const next_themes_1 = require("next-themes");
const Blogs_1 = __importDefault(require("./Blogs"));
const image_1 = __importDefault(require("next/image"));
function Home({ webInfo }) {
    console.log("🚀 ~ file: Home.tsx:24 ~ Home ~ layout:", webInfo);
    const [open, setOpen] = (0, react_1.useState)(false);
    const [activeItem, setActiveItem] = (0, react_1.useState)(0);
    const [route, setRoute] = (0, react_1.useState)("Login");
    const [activeItemIndex, setActiveItemIndex] = (0, react_1.useState)(0);
    const { theme, setTheme } = (0, next_themes_1.useTheme)();
    const chevronWidth = 40;
    (0, react_1.useEffect)(() => {
        setTheme('light');
        aos_1.default.init({
            once: true,
            delay: 300
        });
    }, []);
    return (<div>

         
           

            <Header_1.default open={open} setOpen={setOpen} activeItem={activeItem} setRoute={setRoute} route={route}/>
             <div className="w-[100%] h-auto md:h-[502px] 1000px:flex items-center dark:bg-[#1846a8] ">
                <image_1.default src={'/bannerEX22.png'} width={9000} height={600} alt='' className="object-cover w-full h-full"/>
            </div>
            {/* <Hero
            banner={webInfo?.banner || {}}
            setOpen={setOpen}
        /> */}
            {/* <TopCategory
            categoty={webInfo.category}
        />
        */}
            
              {/*<PeopleReview />*/}
            
            <Course_1.default />
            <Ebooks_1.default />
            <Blogs_1.default />
            <PeopleReview_1.default />
            
            <WhyLearnCourse_1.default />
            <FAQ_1.default /> 
            {/* <TrustBy /> */}
            
            <Footer_1.default />
        </div>);
}
;
exports.default = Home;
