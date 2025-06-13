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
const coursesApi_1 = require("@/redux/features/courses/coursesApi");
const layoutApi_1 = require("@/redux/features/layout/layoutApi");
const navigation_1 = require("next/navigation");
const react_1 = __importStar(require("react"));
const Loader_1 = __importDefault(require("../components/Loader/Loader"));
const Header_1 = __importDefault(require("../components/Header"));
const Heading_1 = __importDefault(require("../utils/Heading"));
const style_1 = require("../styles/style");
const CourseCard_1 = __importDefault(require("../components/Course/CourseCard"));
const Footer_1 = __importDefault(require("../components/Footer"));
const Page = (props) => {
    const searchParams = (0, navigation_1.useSearchParams)();
    const search = searchParams?.get("title");
    const { data, isLoading } = (0, coursesApi_1.useGetUsersAllCoursesQuery)(undefined, {});
    const { data: categoriesData } = (0, layoutApi_1.useGetHeroDataQuery)("Categories", {});
    const [route, setRoute] = (0, react_1.useState)("Login");
    const [open, setOpen] = (0, react_1.useState)(false);
    const [courses, setcourses] = (0, react_1.useState)([]);
    const [category, setCategory] = (0, react_1.useState)("All");
    (0, react_1.useEffect)(() => {
        if (category === "All") {
            setcourses(data?.courses);
        }
        if (category !== "All") {
            setcourses(data?.courses.filter((item) => item.categories === category));
        }
        if (search) {
            setcourses(data?.courses.filter((item) => item.name.toLowerCase().includes(search.toLowerCase())));
        }
    }, [data, category, search]);
    const categories = categoriesData?.layout.categories;
    return (<div>
      {isLoading ? (<Loader_1.default />) : (<>
          <Header_1.default route={route} setRoute={setRoute} open={open} setOpen={setOpen} activeItem={1}/>
          <div className="w-full bg-gradient-4 text-white">
            <div className="w-[95%] 800px:w-[85%] m-auto min-h-[70vh]">
              <Heading_1.default title={"All courses - Elearning"} description={"Elearning is a programming community."} keywords={"programming community, coding skills, expert insights, collaboration, growth"}/>
              <br />
              <div className="w-full flex items-center flex-wrap">
                <div className={`h-[35px] ${category === "All"
                ? "bg-[#008AFC] font-bold"
                : "border-[#008AFC] text-white border-2"} m-3 px-3 rounded-[30px] flex items-center justify-center font-Poppins cursor-pointer`} onClick={() => setCategory("All")}>
                  All
                </div>
                {categories &&
                categories.map((item, index) => (<div key={index}>
                      <div className={`h-[35px] ${category === item.title
                        ? "bg-[#008AFC] font-bold"
                        : "border-[#008AFC] text-white border-2"} m-3 px-3 rounded-[30px] flex items-center justify-center font-Poppins cursor-pointer`} onClick={() => setCategory(item.title)}>
                        {item.title}
                      </div>
                    </div>))}
              </div>
              {courses && courses.length === 0 && (<p className={`${style_1.styles.label} text-white justify-center min-h-[50vh] flex items-center`}>
                  {search
                    ? "No courses found!"
                    : "No courses found in this category. Please try another one!"}
                </p>)}
              <br />
              <br />
              <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] 1500px:grid-cols-4 1500px:gap-[35px] pb-12 border-0">
                {courses &&
                courses.map((item, index) => (<CourseCard_1.default item={item} key={index}/>))}
              </div>
            </div>
          </div>

          <Footer_1.default />
        </>)}
    </div>);
};
exports.default = Page;
