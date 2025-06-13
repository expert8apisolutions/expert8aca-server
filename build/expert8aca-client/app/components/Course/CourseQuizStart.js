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
const flowbite_react_1 = require("flowbite-react");
const react_1 = __importStar(require("react"));
const lu_1 = require("react-icons/lu");
const DialogConfirm_1 = __importDefault(require("../common/DialogConfirm"));
const quizApi_1 = require("@/redux/features/quiz/quizApi");
const dateFomat_1 = require("@/app/utils/dateFomat");
const react_hot_toast_1 = __importDefault(require("react-hot-toast"));
const CourseQuizStart = ({ courseId, quizData, questionList, fetchQuizStatus, submissionId, quizStartInfo, isPreTest, preTestRefetch, }) => {
    const [submitQuiz,] = (0, quizApi_1.useSubmitQuizMutation)();
    const [currentQuestionIndex, setCurrentQuestionIndex] = (0, react_1.useState)(0);
    const currentQuestion = questionList[currentQuestionIndex];
    const totalQuestion = questionList.length;
    const [selectedAnswerList, setSelectedAnswerList] = (0, react_1.useState)(Array(totalQuestion).fill(null));
    const selectedAnswer = selectedAnswerList[currentQuestionIndex];
    const questionNo = currentQuestionIndex + 1;
    const [modalOpen, setModalOpen] = (0, react_1.useState)(false);
    const [showResult, setShowResult] = (0, react_1.useState)({
        isOpen: false,
        isPassed: false,
        score: 0,
        totalScore: 0,
    });
    const preTestId = quizData?.preTestId?._id || quizData.preTestId;
    const postTestId = quizData?.postTestId?._id || quizData.postTestId;
    const totalTime = quizStartInfo?.quiz?.time_limit_minutes || 0;
    const totoalTimeInSecond = totalTime * 60;
    const currentSubmission = quizStartInfo?.currentSubmission || {};
    const startQuizDate = new Date(currentSubmission?.start_date);
    const diffDateInSecond = totoalTimeInSecond - (0, dateFomat_1.DiffBetweenDateInSecond)(new Date(), startQuizDate);
    (0, react_1.useEffect)(() => {
        const preventCopy = (e) => {
            e.preventDefault();
            alert('Copying is not allowed!');
        };
        document.addEventListener('copy', preventCopy);
        // Cleanup function to remove the event listener when the component unmounts
        return () => {
            document.removeEventListener('copy', preventCopy);
        };
    }, []);
    const handleSelectAnswer = (answer) => {
        setSelectedAnswerList((prev) => {
            const newSelectedAnswerList = [...prev];
            newSelectedAnswerList[currentQuestionIndex] = answer;
            return newSelectedAnswerList;
        });
    };
    const handleNext = () => {
        if (currentQuestionIndex < totalQuestion - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };
    const handleBack = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };
    const handleSubmit = () => {
        const newAnswerList = questionList.map((question, index) => {
            return {
                question_id: question._id,
                answer: selectedAnswerList[index]
            };
        });
        const payload = {
            quizId: isPreTest ? preTestId : postTestId,
            body: {
                submissionId,
                course_id: courseId,
                type: isPreTest ? 'pre-test' : 'post-test',
                answers: newAnswerList
            }
        };
        submitQuiz(payload).unwrap().then(result => {
            react_hot_toast_1.default.success("Submit quiz success");
            // console.log("🚀 ~ submitQuiz ~ result:", result)
            // setShowResult({
            //     isOpen: true,
            //     isPassed: result.result.isPassed,
            //     score: result.result.score,
            //     totalScore: result.result.total
            // })
            // console.log("🚀 ~ handleSubmit ~ result", result)
            fetchQuizStatus();
        }).catch(err => {
            react_hot_toast_1.default.error("Submit Quiz fail");
            console.log("🚀 ~ handleSubmit ~ err", err);
        })
            .finally(() => {
            preTestRefetch();
        });
    };
    const handleSelectQuestion = (index) => {
        setCurrentQuestionIndex(index);
    };
    const onClose = () => {
        setModalOpen(false);
    };
    const handleOpenModal = () => {
        setModalOpen(true);
    };
    return (<div>
            <div className="space-y-5 noselect">
                <div className="rounded-lg bg-white shadow w-full p-6 min-w-[800px]">
                    <p className="text-xl">{quizData?.preTestTitle}</p>
                    <div className="mt-5">
                        {/* <Progress progress={45} /> */}
                        {<TimeProgress timeInSecond={diffDateInSecond} totalTimeInSecond={totoalTimeInSecond}/>}
                        <div className="flex justify-between">
                            <p className="text-sm mt-2 text-gray-400">ข้อที่ {questionNo} จาก {totalQuestion} ข้อ</p>
                            <p className="text-sm mt-2 text-gray-400 flex items-center space-x-2">
                                {totalTime > 0 ? <>
                                        <lu_1.LuAlarmClock className="mr-1 text-[14px]"/>
                                        {diffDateInSecond > 0 ?
                <> เหลือเวลา <CountdownTimer onSubmit={handleSubmit} timeInSecond={diffDateInSecond}/> นาที</>
                :
                    <> หมดเวลาเเล้ว</>}

                                    </>
            :
                null}
                            </p>
                        </div>
                    </div>
                </div>
                <BageAllChoice selectedAnswerList={selectedAnswerList} handleSelectQuestion={handleSelectQuestion}/>
                <div className="rounded-lg bg-white shadow w-full p-6 min-w-[700px] spacy-y-4">
                    <p className="text-bold font-semibold">ข้อที่ {questionNo}: {currentQuestion.question}</p>
                    <div className="flex justify-center">
                        {currentQuestion?.image_link && <img src={currentQuestion.image_link} className="max-w-[800px] max-h-[400px]"></img>}
                    </div>
                    <div className="min-h-[400px]">
                        <AnswerContainner question={currentQuestion} index={currentQuestionIndex} selectedAnswer={selectedAnswer} onSelectAnswer={handleSelectAnswer}/>
                    </div>

                    <div className="flex justify-between mt-5">
                        {currentQuestionIndex == 0 && (<div></div>)}
                        {currentQuestionIndex > 0 && (<flowbite_react_1.Button onClick={handleBack} color="gray">{"<"} ข้อก่อนหน้า</flowbite_react_1.Button>)}
                        {currentQuestionIndex < totalQuestion - 1 && (<flowbite_react_1.Button onClick={handleNext} gradientMonochrome="cyan">ข้อถัดไป {">"}</flowbite_react_1.Button>)}
                        {currentQuestionIndex === totalQuestion - 1 && (<flowbite_react_1.Button onClick={() => handleOpenModal()} gradientMonochrome="success">ส่งคำตอบ</flowbite_react_1.Button>)}

                    </div>
                </div>
                <DialogConfirm_1.default onClose={onClose} openModal={modalOpen} okTitle="ยืนยัน" cancelTitle="ยกเลิก" title="ยืนยันการส่งคำตอบ" onConfirm={handleSubmit}/>
            </div>
        </div>);
};
const TimeProgress = ({ timeInSecond, totalTimeInSecond }) => {
    const [currentTime, setCurrentTime] = (0, react_1.useState)(totalTimeInSecond - timeInSecond); // Total time in seconds
    console.log("🚀 ~ TimeProgress ~ currentTime:", currentTime);
    (0, react_1.useEffect)(() => {
        if (currentTime <= totalTimeInSecond) {
            const timer = setTimeout(() => setCurrentTime(currentTime + 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [currentTime]);
    const percentTimeProgress = (currentTime / totalTimeInSecond) * 100;
    return <flowbite_react_1.Progress progress={percentTimeProgress}/>;
};
const CountdownTimer = ({ timeInSecond, onSubmit }) => {
    const [time, setTime] = (0, react_1.useState)(timeInSecond); // Total time in seconds
    (0, react_1.useEffect)(() => {
        if (time > 0) {
            const timer = setTimeout(() => setTime(time - 1), 1000);
            return () => clearTimeout(timer);
        }
        else {
            onSubmit();
        }
    }, [time]);
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
            .toString()
            .padStart(2, "0")}`;
    };
    return <span>{formatTime(time)}&nbsp;</span>;
};
const AnswerContainner = ({ question, index, selectedAnswer, onSelectAnswer }) => {
    console.log("🚀 ~ AnswerContainner ~ question:", question);
    return (<div className="flex flex-col gap-4">
            <p className="text-bold font-semibold">{question.text}</p>
            <div className="flex flex-col gap-4">
                {question.choices.map((choice, index) => (<Choice key={`choices-${index}`} isSelected={selectedAnswer === choice.choice} index={index} choice={choice.choice} answer={choice.answer} onSelectAnswer={onSelectAnswer}/>))}
            </div>
        </div>);
};
const Choice = ({ index, choice, answer, onSelectAnswer, isSelected }) => {
    return (<div onClick={() => onSelectAnswer(choice)} className={`flex items-center ${isSelected ? 'bg-[#0ad2f633]' : 'bg-gray-100 hover:bg-gray-200'} gap-2 p-5 rounded-lg cursor-pointer`}>
            <div className="flex gap-2 relative pl-[40px]">
                <div className={`absolute top-0 left-0 font-bold rounded-full ${isSelected ? 'bg-[#37a2b1] text-white' : 'text-[#0a090973] bg-[#dfdfdf]'}  min-w-[25px] min-h-[25px] flex justify-center items-center`}>
                    <p>
                        {choice}
                    </p>
                </div>
                <span>
                    {answer}
                </span>
            </div>

        </div>);
};
const BageAllChoice = ({ selectedAnswerList, handleSelectQuestion }) => {
    return <>
        <div className="flex flex-wrap gap-2 pb-[20px]">
            {selectedAnswerList.map((choice, index) => (<div key={`BageAllChoice-${index}`} className="relative w-[30px]">
                        <div onClick={() => handleSelectQuestion(index)} className={`${choice !== null ? " border border-cyan-500" : ""} bg-gray-100 p-2 rounded-full w-[30px] h-[30px] absolute top-0 left-0 flex justify-center items-center cursor-pointer`}>
                            <p className="text-[12px]">
                                {index + 1}
                            </p>
                        </div>
                    </div>))}
        </div>

    </>;
};
exports.default = CourseQuizStart;
