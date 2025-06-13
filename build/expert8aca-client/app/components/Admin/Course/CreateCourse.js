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
exports.TabCourseEnum = void 0;
const react_1 = __importStar(require("react"));
const CourseInformation_1 = __importDefault(require("./CourseInformation"));
const CourseOptions_1 = __importDefault(require("./CourseOptions"));
const CourseData_1 = __importDefault(require("./CourseData"));
const CoursePreview_1 = __importDefault(require("./CoursePreview"));
const coursesApi_1 = require("../../../../redux/features/courses/coursesApi");
const react_hot_toast_1 = require("react-hot-toast");
const navigation_1 = require("next/navigation");
const CourseContentNew_1 = __importDefault(require("./CourseContentNew"));
const CourseQuiz_1 = __importDefault(require("./CourseQuiz"));
var TabCourseEnum;
(function (TabCourseEnum) {
    TabCourseEnum[TabCourseEnum["CourseInformation"] = 0] = "CourseInformation";
    TabCourseEnum[TabCourseEnum["CourseData"] = 1] = "CourseData";
    TabCourseEnum[TabCourseEnum["CourseQuiz"] = 2] = "CourseQuiz";
    TabCourseEnum[TabCourseEnum["CourseContent"] = 3] = "CourseContent";
    TabCourseEnum[TabCourseEnum["CoursePreview"] = 4] = "CoursePreview";
})(TabCourseEnum || (exports.TabCourseEnum = TabCourseEnum = {}));
const CreateCourse = (props) => {
    const [createCourse, { isLoading, isSuccess, error }] = (0, coursesApi_1.useCreateCourseMutation)();
    (0, react_1.useEffect)(() => {
        if (isSuccess) {
            react_hot_toast_1.toast.success("Course created successfully");
            (0, navigation_1.redirect)("/admin/courses");
        }
        if (error) {
            if ("data" in error) {
                const errorMessage = error;
                react_hot_toast_1.toast.error(errorMessage.data.message);
            }
        }
    }, [isSuccess, error]);
    const [active, setActive] = (0, react_1.useState)(0);
    const [courseInfo, setCourseInfo] = (0, react_1.useState)({
        name: "",
        description: "",
        price: "",
        estimatedPrice: "",
        tags: "",
        level: "",
        categories: "",
        certificate: "Process",
        demoUrl: "",
        thumbnail: "",
        status: "public",
        limitWatchedTime: 1000,
        quiz: {
            preTestEnabled: false,
            preTestTitle: "แบบทดสอบก่อนเรียน",
            preTestId: "",
            postTestEnabled: false,
            postTestTitle: "แบบทดสอบหลังเรียน",
            postTestId: "",
        }
    });
    const [benefits, setBenefits] = (0, react_1.useState)([{ title: "" }]);
    const [prerequisites, setPrerequisites] = (0, react_1.useState)([{ title: "" }]);
    const [courseContentData, setCourseContentData] = (0, react_1.useState)([
        {
            videoSection: "Untitled Section",
            videoList: [
                {
                    canPreview: false,
                    videoUrl: "",
                    title: "",
                    description: "",
                    videoLength: "",
                    links: [
                        {
                            title: "",
                            url: "",
                        },
                    ],
                    suggestion: "",
                },
            ]
        }
    ]);
    const [courseData, setCourseData] = (0, react_1.useState)({});
    const handleSubmit = async () => {
        // Format benefits array
        const formattedBenefits = benefits.map((benefit) => ({
            title: benefit.title,
        }));
        // Format prerequisites array
        const formattedPrerequisites = prerequisites.map((prerequisite) => ({
            title: prerequisite.title,
        }));
        // Format course content array
        let newCourseContentData = [];
        courseContentData.forEach((courseContent) => {
            courseContent.videoList.forEach((video) => {
                const formattedVideoList = {
                    videoSection: courseContent.videoSection,
                    videoUrl: video.videoUrl,
                    title: video.title,
                    description: video.description,
                    videoLength: video.videoLength,
                    links: video.links,
                    suggestion: video.suggestion,
                };
                newCourseContentData.push(formattedVideoList);
            });
        });
        //   prepare our data object
        const data = {
            name: courseInfo.name,
            description: courseInfo.description,
            categories: courseInfo.categories,
            price: courseInfo.price,
            estimatedPrice: courseInfo.estimatedPrice,
            tags: courseInfo.tags,
            thumbnail: courseInfo.thumbnail,
            level: courseInfo.level,
            demoUrl: courseInfo.demoUrl,
            status: courseInfo.status,
            totalVideos: courseContentData.length,
            benefits: formattedBenefits,
            prerequisites: formattedPrerequisites,
            courseData: newCourseContentData,
            limitWatchedTime: +courseInfo.limitWatchedTime,
            quiz: courseInfo.quiz,
            certificate: courseInfo.certificate
        };
        setCourseData(data);
    };
    const handleCourseCreate = async (e) => {
        const data = courseData;
        if (!isLoading) {
            await createCourse(data);
        }
    };
    return (<div className="w-full flex min-h-screen">
      <div className="w-[80%]">
        {active === TabCourseEnum.CourseInformation && (<CourseInformation_1.default courseInfo={courseInfo} setCourseInfo={setCourseInfo} active={active} setActive={setActive}/>)}

        {active === TabCourseEnum.CourseData && (<CourseData_1.default benefits={benefits} setBenefits={setBenefits} prerequisites={prerequisites} setPrerequisites={setPrerequisites} active={active} setActive={setActive}/>)}

        {active === TabCourseEnum.CourseQuiz && (<CourseQuiz_1.default courseInfo={courseInfo} setCourseInfo={setCourseInfo} active={active} setActive={setActive}/>)}

        {active === TabCourseEnum.CourseContent && (<CourseContentNew_1.default active={active} setActive={setActive} courseContentData={courseContentData} setCourseContentData={setCourseContentData} handleSubmit={handleSubmit}/>)}

        {active === TabCourseEnum.CoursePreview && (<CoursePreview_1.default active={active} setActive={setActive} courseData={courseData} handleCourseCreate={handleCourseCreate}/>)}
      </div>
      <div className="w-[20%] mt-[100px] h-screen fixed z-[-1] top-18 right-0">
        <CourseOptions_1.default active={active} setActive={setActive}/>
      </div>
    </div>);
};
exports.default = CreateCourse;
