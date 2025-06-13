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
const coursesApi_1 = require("@/redux/features/courses/coursesApi");
const react_1 = __importStar(require("react"));
const Loader_1 = __importDefault(require("../Loader/Loader"));
const Heading_1 = __importDefault(require("@/app/utils/Heading"));
const CourseContentMedia_1 = __importDefault(require("./CourseContentMedia"));
const Header_1 = __importDefault(require("../Header"));
const CourseContentList_1 = __importDefault(require("./CourseContentList"));
const flowbite_react_1 = require("flowbite-react");
const LinearProgress_1 = __importDefault(require("@mui/material/LinearProgress"));
const Typography_1 = __importDefault(require("@mui/material/Typography"));
const Box_1 = __importDefault(require("@mui/material/Box"));
const pi_1 = require("react-icons/pi");
const pi_2 = require("react-icons/pi");
const fa6_1 = require("react-icons/fa6");
const CourseQuizTab_1 = __importDefault(require("./CourseQuizTab"));
const quizApi_1 = require("@/redux/features/quiz/quizApi");
const react_redux_1 = require("react-redux");
const pdfgen_1 = __importDefault(require("../../components/Certificate/pdfgen"));
function LinearProgressWithLabel(props) {
    return (<Box_1.default sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
      <Box_1.default sx={{ width: '100%', mr: 1, display: 'flex', alignItems: 'center' }}>
        <Box_1.default sx={{ width: '100%' }}>
          <LinearProgress_1.default variant="determinate" {...props}/>
        </Box_1.default>
        <Box_1.default sx={{ minWidth: 20, backgroundColor: '#fef5e7', padding: '5px', marginLeft: '5px' }}>
          <fa6_1.FaAward size={20} className="text-[#faa718]"/>
        </Box_1.default>
      </Box_1.default>
      <Box_1.default sx={{ minWidth: 40, display: 'flex', gap: 1, marginTop: '-10px' }}>
        <Typography_1.default variant="body2" color="text.secondary">
          {`${Math.round(props.value)}%`}</Typography_1.default>
        <Typography_1.default variant="body2" color="text.secondary">
          completed
        </Typography_1.default>

      </Box_1.default>
    </Box_1.default>);
}
const CourseContent = ({ id, user }) => {
    const { data: contentData, isLoading, refetch, } = (0, coursesApi_1.useGetCourseContentQuery)(id, { refetchOnMountOrArgChange: true });
    const { data: courseData, refetch: courseRefetch } = (0, coursesApi_1.useGetCourseDetailsQuery)(id, { refetchOnMountOrArgChange: true });
    const { responseUpdateWatched } = (0, react_redux_1.useSelector)((state) => state.courses);
    const totalWatched = responseUpdateWatched?.total_watch_time || 0;
    const quiz = courseData?.course?.quiz || {};
    const preTestId = quiz?.preTestId?._id || quiz.preTestId;
    const { data: preTestData, refetch: preTestRefetch } = (0, quizApi_1.useGetQuizInfoQuery)(preTestId && { quiz_id: preTestId, course_id: id });
    const [open, setOpen] = (0, react_1.useState)(false);
    const [isOpenQuiz, setIsOpenQuiz] = (0, react_1.useState)(false);
    const [isPretest, setIsPretest] = (0, react_1.useState)(false);
    const [route, setRoute] = (0, react_1.useState)("Login");
    const data = contentData?.content;
    const { data: userProgressData, isLoading: userProgressLoading, refetch: refetchUserProgress, } = (0, coursesApi_1.useGetUserProgressQuery)(id, { refetchOnMountOrArgChange: true });
    const [currentTime, setCurrentTime] = (0, react_1.useState)(0);
    const [activeVideo, setActiveVideo] = (0, react_1.useState)(0);
    const [isPretestPass, setIsPretestPass] = (0, react_1.useState)(false);
    const [pdfModal, setPdfModal] = (0, react_1.useState)(false);
    const percentage = data?.length ? ((userProgressData?.userProgress?.video_compleated_id?.length || 0) / data.length) * 100 : 0;
    (0, react_1.useEffect)(() => {
        if (data?.length && userProgressData?.userProgress?.video_compleated_id?.length && activeVideo === 0) {
            const lastVideo = userProgressData?.userProgress?.video_compleated_id?.[userProgressData?.userProgress?.video_compleated_id?.length - 1];
            const index = data.findIndex((item) => item._id === lastVideo?.video_id);
            if (index !== data.length - 1) {
                setActiveVideo(index + 1);
            }
        }
        return () => {
        };
    }, [data, userProgressData]);
    const ButtonCert = () => {
        // console.log(courseData?.course?.certificate);
        if (!courseData?.course?.certificate) {
            return <></>;
        }
        if (courseData?.course?.certificate == 'PostTest' && !preTestData?.result?.post_test_passed) {
            return <></>;
        }
        else if (courseData?.course?.certificate == 'Process' && percentage !== 100) {
            return <></>;
        }
        else if (courseData?.course?.certificate == 'PostTest or Process') {
            if (!preTestData?.result?.post_test_passed && percentage !== 100) {
                return <></>;
            }
        }
        return <>
      <flowbite_react_1.Button className="w-full mt-4" color="gray" onClick={() => {
                setPdfModal(true);
            }}>
        <pi_2.PiBookOpenText className="mr-2 h-5 w-5"/>
        Certificate
      </flowbite_react_1.Button>
    </>;
    };
    return (<>
      {(isLoading && !data) ? (<Loader_1.default />) : (<>
          <Header_1.default activeItem={1} open={open} setOpen={setOpen} route={route} setRoute={setRoute}/>
          <div className="w-full grid 800px:grid-cols-1">
            <Heading_1.default title={data?.[activeVideo]?.title} description="anything" keywords={data?.[activeVideo]?.tags}/>
            <div className="w-full bg-gradient-9 text-black mt-5">
              <div className="flex flex-col-reverse md:flex-row px-5 md:px-10">
                <div className=" text-black max-w-[665px] md:min-w-[300px]">
                  <div>
                    <LinearProgressWithLabel value={percentage}/>
                  </div>
                  {quiz?.preTestEnabled && (<div className="mt-5">
                        <flowbite_react_1.Button onClick={() => {
                    setIsOpenQuiz(true);
                    setIsPretest(true);
                    setActiveVideo(-1);
                }} className="w-full" color="gray">
                          <pi_1.PiBookBookmarkLight className="mr-2 h-5 w-5"/>
                          {quiz?.preTestTitle}
                        </flowbite_react_1.Button>
                      </div>)}
                  <CourseContentList_1.default userProgress={userProgressData?.userProgress || {}} setActiveVideo={(value) => {
                setActiveVideo(value);
                setIsOpenQuiz(false);
            }} data={data} activeVideo={activeVideo}/>
                  {quiz?.postTestEnabled && (<div className="mt-5">
                        <flowbite_react_1.Button disabled={!preTestData?.result?.pre_test_passed} className="w-full" color="gray" onClick={() => {
                    setIsOpenQuiz(true);
                    setIsPretest(false);
                    setActiveVideo(-1);
                }}>
                          <pi_2.PiBookOpenText className="mr-2 h-5 w-5"/>
                          {quiz?.postTestTitle}
                        </flowbite_react_1.Button>
                      </div>)}
                  <ButtonCert />

                </div>
                <div className="md:pl-3 pt-3 w-full flex justify-center">
                  {isOpenQuiz ? (<CourseQuizTab_1.default courseId={id} isPreTest={isPretest} quizData={quiz} preTestRefetch={preTestRefetch}/>)
                : <>
                        {<CourseContentMedia_1.default refetchUserProgress={refetchUserProgress} totalWatched={totalWatched} totalLimitWatch={courseData?.course?.limitWatchedTime} videoList={data} id={id} activeVideo={activeVideo} setActiveVideo={setActiveVideo} user={user} refetch={refetch}/>}


                      </>}

                </div>
              </div>
            </div>
          </div>
        </>)}

      <pdfgen_1.default openModal={pdfModal} onClose={() => { setPdfModal(false); }} data={{
            data: courseData, name: user.name,
            date: userProgressData?.userProgress?.createdAt
        }}/>
    </>);
};
exports.default = CourseContent;
