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
exports.QUIZ_TYPE = exports.QUIZ_STAGE = void 0;
const flowbite_react_1 = require("flowbite-react");
const react_1 = __importStar(require("react"));
const vsc_1 = require("react-icons/vsc");
const CourseQuizStart_1 = __importDefault(require("./CourseQuizStart"));
const quizApi_1 = require("@/redux/features/quiz/quizApi");
const react_hot_toast_1 = require("react-hot-toast");
const CourseQuizResult_1 = __importDefault(require("./CourseQuizResult"));
const CourseQuizCheck_1 = __importDefault(require("./CourseQuizCheck"));
exports.QUIZ_STAGE = {
    NOT_START: "NOT_START",
    PENDING: "PENDING",
    COMPLETED: "COMPLETED",
    FAILED: "FAILED",
};
exports.QUIZ_TYPE = {
    PRE_TEST: "pre-test",
    POST_TEST: "post-test",
};
var TAB_ENUM;
(function (TAB_ENUM) {
    TAB_ENUM[TAB_ENUM["INITIAL"] = 0] = "INITIAL";
    TAB_ENUM[TAB_ENUM["INTRO_QUIZ"] = 1] = "INTRO_QUIZ";
    TAB_ENUM[TAB_ENUM["START_QUIZ"] = 2] = "START_QUIZ";
    TAB_ENUM[TAB_ENUM["CHECK_ANSWER"] = 3] = "CHECK_ANSWER";
    TAB_ENUM[TAB_ENUM["RESULT"] = 4] = "RESULT";
})(TAB_ENUM || (TAB_ENUM = {}));
const CourseQuizTab = ({ quizData, isPreTest, courseId, preTestRefetch }) => {
    const [startQuiz] = (0, quizApi_1.useStartQuizMutation)();
    const [questionList, setQuestionList] = react_1.default.useState([]);
    const [getQuizStatus,] = (0, quizApi_1.useGetQuizStatusMutation)();
    const [tab, setTab] = react_1.default.useState(TAB_ENUM.INITIAL);
    console.log("🚀 ~ CourseQuizTab ~ tab:", tab);
    const [quizSubmission, setQuizSubmission] = react_1.default.useState({});
    const [answerList, setAnswerList] = react_1.default.useState([]);
    const [lastSubmission, setLastSubmission] = react_1.default.useState({
        score: 0,
        totalScore: 0,
        isPassed: false,
        submit_date: ''
    });
    const quizType = isPreTest ? exports.QUIZ_TYPE.PRE_TEST : exports.QUIZ_TYPE.POST_TEST;
    const [submissionId, setSubmissionId] = react_1.default.useState('');
    const preTestId = quizData?.preTestId?._id || quizData.preTestId;
    const [quizStartInfo, setQuizStartInfo] = react_1.default.useState({});
    (0, react_1.useEffect)(() => {
        fetchQuizStatus();
    }, []);
    (0, react_1.useEffect)(() => {
        fetchQuizStatus();
    }, [isPreTest]);
    const fetchQuizStatus = () => {
        console.log("🚀 ~ fetchQuizStatus ~ payload.quizData:", quizData);
        const payload = {
            quizId: isPreTest ? preTestId : quizData?.postTestId?._id,
            body: {
                course_id: courseId,
                type: isPreTest ? exports.QUIZ_TYPE.PRE_TEST : exports.QUIZ_TYPE.POST_TEST,
            }
        };
        getQuizStatus(payload).unwrap().then(({ result }) => {
            const { quizSubmission, quiz, } = result;
            const quizStatus = isPreTest ? quizSubmission?.pre_test_status : quizSubmission?.post_test_status || null;
            if (quizStatus === exports.QUIZ_STAGE.COMPLETED) {
                const selectTest = isPreTest ? quizSubmission.pre_test : quizSubmission.post_test;
                const answerList = selectTest[selectTest.length - 1].answerList;
                const mapAnswerList = answerList.map(item => item.answer);
                console.log("🚀 ~ getQuizStatus ~ mapAnswerList:", mapAnswerList);
                const lastSubmission = selectTest[selectTest.length - 1];
                setQuizSubmission(quizSubmission);
                setLastSubmission({
                    ...lastSubmission,
                    totalScore: lastSubmission.answerList.length
                });
                setQuestionList(quiz.quizItem);
                setAnswerList(mapAnswerList);
                setSubmissionId(result?.submissionId ?? '');
                setQuizStartInfo(result);
                setTimeout(() => {
                    setTab(TAB_ENUM.RESULT);
                }, 0);
            }
            else if (quizStatus === exports.QUIZ_STAGE.NOT_START) {
                console.log('in not start');
                setQuizStartInfo(result);
                setTab(TAB_ENUM.INTRO_QUIZ);
            }
            else if (quizStatus === exports.QUIZ_STAGE.PENDING) {
                setQuestionList(quiz.quizItem);
                setSubmissionId(result?.submissionId ?? '');
                setQuizStartInfo({
                    ...result,
                    currentSubmission: lastSubmission,
                });
                setTimeout(() => {
                    setTab(TAB_ENUM.START_QUIZ);
                }, 0);
            }
            else {
                setQuizStartInfo(result);
                setTab(TAB_ENUM.INTRO_QUIZ);
            }
            console.log("🚀 ~ fetchQuizStatus ~ result", result);
        }).catch(err => {
            console.log("🚀 ~ getQuizStatus ~ err:", err);
            react_hot_toast_1.toast.error(err?.data?.message || "Failed to fetch quiz status");
        });
    };
    const handleClickStartQuiz = async () => {
        const payload = {
            quizId: preTestId,
            body: {
                course_id: courseId,
                type: isPreTest ? 'pre-test' : 'post-test',
            }
        };
        await startQuiz(payload).unwrap().then(result => {
            const { quizItem } = result.quiz;
            const { quizSubmission } = result;
            const selectQuiz = isPreTest ? quizSubmission.pre_test : quizSubmission.post_test;
            setQuizStartInfo({
                ...result,
                currentSubmission: selectQuiz[selectQuiz.length - 1]
            });
            setQuestionList(quizItem);
            setSubmissionId(result.submissionId);
            setTimeout(() => {
                setTab(TAB_ENUM.START_QUIZ);
            }, 0);
        }).catch(err => {
            console.error("🚀 ~ awaitstartQuiz ~ err:", err);
            react_hot_toast_1.toast.error(err?.data?.message || "Failed to start quiz");
        });
    };
    const handleShowCheckAnswer = () => {
        setTab(TAB_ENUM.CHECK_ANSWER);
    };
    const totalQuestion = quizStartInfo?.quiz?.quizItem?.length ?? 0;
    const amountItemPassFromPercent = Math.floor((quizStartInfo?.quiz?.pass_percentage * totalQuestion) / 100);
    const quizTitle = isPreTest ? quizData.preTestTitle : quizData.postTestTitle;
    return (<div className=''>
      {isPreTest ? (<div className='mt-5 flex justify-center flex-col items-center space-y-3 w-[800px] max-w-[800px]'>
            {tab === TAB_ENUM.RESULT ? (<>
                  <CourseQuizResult_1.default onReQuiz={() => setTab(TAB_ENUM.INTRO_QUIZ)} histoyList={quizSubmission.pre_test ?? []} isPassed={lastSubmission.isPassed} score={lastSubmission.score} totalScore={lastSubmission.totalScore} onCheckAnswer={handleShowCheckAnswer} title={quizTitle} maxSubmit={isPreTest ? quizStartInfo?.quiz?.max_submission_pre_test : quizStartInfo?.quiz?.max_submission_post_test}/>
                </>) : null}
            {tab === TAB_ENUM.CHECK_ANSWER ? (<div>
                  <CourseQuizCheck_1.default answerList={answerList} questionList={questionList} quizData={quizData} onBack={() => setTab(TAB_ENUM.RESULT)}/>
                </div>) : null}
            {tab === TAB_ENUM.START_QUIZ ? (<CourseQuizStart_1.default preTestRefetch={preTestRefetch} isPreTest={isPreTest} submissionId={submissionId} courseId={courseId} questionList={questionList} quizData={quizData} quizStartInfo={quizStartInfo} fetchQuizStatus={fetchQuizStatus}/>) : null}
            {tab === TAB_ENUM.INTRO_QUIZ ? (<>
                  <h1 className='text-xl font-semibold'>{quizStartInfo?.quiz?.name}</h1>
                  <p>แบบทดสอบก่อนเรียน</p>
                  <p>ข้อสอบทั้งหมด {quizStartInfo?.quiz?.quizItem?.length} ข้อ</p>
                  <p>ต้องผ่านด้วยคะแนนมากกว่า {quizStartInfo?.quiz?.pass_percentage}% ({amountItemPassFromPercent}/{totalQuestion})</p>
                  <p>สามารถทำแบบทดสอบนี้ได้ {isPreTest ? quizStartInfo?.quiz?.max_submission_pre_test : quizStartInfo?.quiz?.max_submission_post_test} ครั้ง</p>
                  <p>มีเวลาทำแบบทดสอบทั้งหมด {quizStartInfo?.quiz?.time_limit_minutes} นาที</p>
                  <flowbite_react_1.Button onClick={handleClickStartQuiz} label="1"><vsc_1.VscNotebook className="mr-2 h-5 w-5"/>เริ่มทำแบบทดสอบ</flowbite_react_1.Button>
                </>) : null}
          </div>) : (<div className='mt-5 flex justify-center flex-col items-center space-y-3 w-[800px] max-w-[800px]'>
            {tab === TAB_ENUM.RESULT ? (<>
                  <CourseQuizResult_1.default onReQuiz={() => setTab(TAB_ENUM.INTRO_QUIZ)} histoyList={quizSubmission.post_test ?? []} isPassed={lastSubmission.isPassed} score={lastSubmission.score} totalScore={lastSubmission.totalScore} onCheckAnswer={handleShowCheckAnswer} title={quizTitle} maxSubmit={isPreTest ? quizStartInfo?.quiz?.max_submission_pre_test : quizStartInfo?.quiz?.max_submission_post_test}/>
                </>) : null}
            {tab === TAB_ENUM.CHECK_ANSWER ? (<div>
                  <CourseQuizCheck_1.default answerList={answerList} questionList={questionList} quizData={quizData} onBack={() => setTab(TAB_ENUM.RESULT)}/>
                </div>) : null}
            {tab === TAB_ENUM.START_QUIZ ? (<CourseQuizStart_1.default isPreTest={isPreTest} submissionId={submissionId} courseId={courseId} questionList={questionList} quizData={quizData} quizStartInfo={quizStartInfo} fetchQuizStatus={fetchQuizStatus} preTestRefetch={preTestRefetch}/>) : null}
            {tab === TAB_ENUM.INTRO_QUIZ ? (<>
                  <h1 className='text-xl font-semibold'>{quizStartInfo?.quiz?.name}</h1>
                  <p>แบบทดสอบหลังเรียน</p>
                  <p>ข้อสอบทั้งหมด {quizStartInfo?.quiz?.quizItem?.length} ข้อ</p>
                  <p>ต้องผ่านด้วยคะแนนมากกว่า {quizStartInfo?.quiz?.pass_percentage}% ({amountItemPassFromPercent}/{totalQuestion})</p>
                  <p>สามารถทำแบบทดสอบนี้ได้ {isPreTest ? quizStartInfo?.quiz?.max_submission_pre_test : quizStartInfo?.quiz?.max_submission_post_test} ครั้ง</p>
                  <p>มีเวลาทำแบบทดสอบทั้งหมด {quizStartInfo?.quiz?.time_limit_minutes} นาที</p>
                  <flowbite_react_1.Button onClick={handleClickStartQuiz} label="1"><vsc_1.VscNotebook className="mr-2 h-5 w-5"/>เริ่มทำแบบทดสอบ</flowbite_react_1.Button>
                </>) : null}
          </div>)}
    </div>);
};
exports.default = CourseQuizTab;
