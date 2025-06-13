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
const CourseInformation_1 = __importDefault(require("./CourseInformation"));
const CourseOptions_1 = __importDefault(require("./CourseOptions"));
const CourseData_1 = __importDefault(require("./CourseData"));
const CoursePreview_1 = __importDefault(require("./CoursePreview"));
const coursesApi_1 = require("../../../../redux/features/courses/coursesApi");
const react_hot_toast_1 = require("react-hot-toast");
const navigation_1 = require("next/navigation");
const CreateCourse_1 = require("./CreateCourse");
const CourseContentNew_1 = __importDefault(require("./CourseContentNew"));
const CourseQuiz_1 = __importDefault(require("./CourseQuiz"));
const EditCourse = ({ id }) => {
    const [editCourse, { isSuccess, error }] = (0, coursesApi_1.useEditCourseMutation)();
    const { data, refetch } = (0, coursesApi_1.useGetAllCoursesQuery)({}, { refetchOnMountOrArgChange: true });
    const [active, setActive] = (0, react_1.useState)(0);
    const [courseInfo, setCourseInfo] = (0, react_1.useState)({
        status: "Public",
        name: "",
        description: "",
        price: "",
        estimatedPrice: "",
        certificate: "",
        tags: "",
        level: "",
        categories: "",
        demoUrl: "",
        thumbnail: "",
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
            ],
        },
    ]);
    const [courseData, setCourseData] = (0, react_1.useState)({});
    const editCourseData = data && data.courses.find((i) => i._id === id);
    console.log(courseInfo);
    (0, react_1.useEffect)(() => {
        if (isSuccess) {
            react_hot_toast_1.toast.success("Course Updated successfully");
            (0, navigation_1.redirect)("/admin/courses");
        }
        if (error) {
            if ("data" in error) {
                const errorMessage = error;
                react_hot_toast_1.toast.error(errorMessage.data.message);
            }
        }
    }, [isSuccess, error]);
    (0, react_1.useEffect)(() => {
        if (editCourseData) {
            setCourseInfo({
                name: editCourseData.name,
                description: editCourseData.description,
                price: editCourseData.price,
                estimatedPrice: editCourseData?.estimatedPrice,
                tags: editCourseData.tags,
                level: editCourseData.level,
                status: editCourseData.status || "Public",
                categories: editCourseData.categories,
                demoUrl: editCourseData.demoUrl,
                thumbnail: editCourseData?.thumbnail?.url,
                limitWatchedTime: editCourseData?.limitWatchedTime || 1000,
                quiz: {
                    preTestEnabled: editCourseData?.quiz?.preTestEnabled,
                    preTestTitle: editCourseData?.quiz?.preTestTitle,
                    preTestId: editCourseData?.quiz?.preTestId,
                    postTestEnabled: editCourseData?.quiz?.postTestEnabled,
                    postTestTitle: editCourseData?.quiz?.postTestTitle,
                    postTestId: editCourseData?.quiz?.postTestId,
                },
                certificate: editCourseData?.certificate
            });
            setBenefits(editCourseData.benefits);
            setPrerequisites(editCourseData.prerequisites);
            const newFomatCourseData = genDataToNewFomat(editCourseData.courseData);
            setCourseContentData(newFomatCourseData);
        }
    }, [editCourseData]);
    const genDataToNewFomat = (courseData) => {
        let newCourseData = [];
        for (let eachVideo of courseData) {
            const foundCurrentSectionIndex = newCourseData.findIndex((ele) => ele.videoSection === eachVideo.videoSection);
            if (foundCurrentSectionIndex > -1) {
                newCourseData[foundCurrentSectionIndex].videoList.push({
                    canPreview: eachVideo.canPreview,
                    videoUrl: eachVideo.videoUrl,
                    title: eachVideo.title,
                    description: eachVideo.description,
                    videoLength: eachVideo.videoLength,
                    links: eachVideo.links,
                    suggestion: eachVideo.suggestion,
                });
            }
            else {
                newCourseData.push({
                    videoSection: eachVideo.videoSection,
                    videoList: [
                        {
                            canPreview: eachVideo.canPreview,
                            videoUrl: eachVideo.videoUrl,
                            title: eachVideo.title,
                            description: eachVideo.description,
                            videoLength: eachVideo.videoLength,
                            links: eachVideo.links,
                            suggestion: eachVideo.suggestion,
                        },
                    ],
                });
            }
        }
        return newCourseData;
    };
    const handleSubmit = async () => {
        // Format benefits array
        const formattedBenefits = benefits.map((benefit) => ({
            title: benefit.title,
        }));
        // Format prerequisites array
        const formattedPrerequisites = prerequisites.map((prerequisite) => ({
            title: prerequisite.title,
        }));
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
            status: courseInfo.status,
            level: courseInfo.level,
            demoUrl: courseInfo.demoUrl,
            totalVideos: courseContentData.length,
            benefits: formattedBenefits,
            prerequisites: formattedPrerequisites,
            courseData: newCourseContentData,
            limitWatchedTime: +courseInfo.limitWatchedTime,
            quiz: courseInfo.quiz,
            certificate: courseInfo.certificate,
        };
        setCourseData(data);
    };
    const handleCourseCreate = async (e) => {
        const data = courseData;
        await editCourse({ id: editCourseData?._id, data });
    };
    return (<div className="w-full flex min-h-screen">
      <div className="w-[80%]">
        {active === CreateCourse_1.TabCourseEnum.CourseInformation && (<CourseInformation_1.default courseInfo={courseInfo} setCourseInfo={setCourseInfo} active={active} setActive={setActive}/>)}

        {active === CreateCourse_1.TabCourseEnum.CourseData && (<CourseData_1.default benefits={benefits} setBenefits={setBenefits} prerequisites={prerequisites} setPrerequisites={setPrerequisites} active={active} setActive={setActive}/>)}

        {active === CreateCourse_1.TabCourseEnum.CourseQuiz && (<CourseQuiz_1.default courseInfo={courseInfo} setCourseInfo={setCourseInfo} active={active} setActive={setActive}/>)}

        {active === CreateCourse_1.TabCourseEnum.CourseContent && (<CourseContentNew_1.default active={active} setActive={setActive} courseContentData={courseContentData} setCourseContentData={setCourseContentData} handleSubmit={handleSubmit}/>)}

        {active === CreateCourse_1.TabCourseEnum.CoursePreview && (<CoursePreview_1.default active={active} setActive={setActive} courseData={courseData} handleCourseCreate={handleCourseCreate} isEdit={true}/>)}
      </div>
      <div className="w-[20%] mt-[100px] h-screen fixed z-[-1] top-18 right-0">
        <CourseOptions_1.default active={active} setActive={setActive}/>
      </div>
    </div>);
};
exports.default = EditCourse;
