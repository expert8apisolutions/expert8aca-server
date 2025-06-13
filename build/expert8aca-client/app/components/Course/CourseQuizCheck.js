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
Object.defineProperty(exports, "__esModule", { value: true });
const flowbite_react_1 = require("flowbite-react");
const react_1 = __importStar(require("react"));
const CourseQuizCheck = ({ quizData, questionList, answerList, onBack, }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = (0, react_1.useState)(0);
    const currentQuestion = questionList[currentQuestionIndex];
    const totalQuestion = questionList.length;
    const [selectedAnswerList, setSelectedAnswerList] = (0, react_1.useState)(Array(totalQuestion).fill(null));
    console.log("🚀 ~ selectedAnswerList:", selectedAnswerList);
    const selectedAnswer = selectedAnswerList[currentQuestionIndex];
    const questionNo = currentQuestionIndex + 1;
    (0, react_1.useEffect)(() => {
        const preventCopy = (e) => {
            e.preventDefault();
            alert('Copying is not allowed!');
        };
        document.addEventListener('copy', preventCopy);
        // Cleanup function to remove the event listener when the component unmounts
        setSelectedAnswerList(answerList);
        return () => {
            document.removeEventListener('copy', preventCopy);
        };
    }, []);
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
    const handleSelectQuestion = (index) => {
        setCurrentQuestionIndex(index);
    };
    return (<div className="font-Poppins">
            <flowbite_react_1.Button onClick={onBack} color="gray" className="mb-5">{"<"} ย้อนกลับ</flowbite_react_1.Button>
            <div className="space-y-5 noselect">
                <div className="rounded-lg bg-white shadow w-full p-6 min-w-[800px]">
                    <p className="text-xl">{quizData?.preTestTitle}</p>
                    <div className="mt-5">
                        <div className="flex justify-between">
                            <p className="text-sm mt-2 text-gray-400">ข้อที่ {questionNo} จาก {totalQuestion} ข้อ</p>                           
                        </div>
                    </div>
                </div>
                <BageAllChoice selectedAnswerList={selectedAnswerList} handleSelectQuestion={handleSelectQuestion}/>
                <div className="rounded-lg bg-white shadow w-full p-6 min-w-[700px] spacy-y-4">
                    <p className="text-bold font-semibold">ข้อที่ {questionNo}: {currentQuestion.question}</p>
                    <AnswerContainner question={currentQuestion} index={currentQuestionIndex} selectedAnswer={selectedAnswer}/>                   
                    <div className="flex justify-between mt-5">
                        {currentQuestionIndex == 0 && (<div></div>)}
                        {currentQuestionIndex > 0 && (<flowbite_react_1.Button onClick={handleBack} color="gray">{"<"} ข้อก่อนหน้า</flowbite_react_1.Button>)}
                        {currentQuestionIndex < totalQuestion - 1 && (<flowbite_react_1.Button onClick={handleNext} gradientMonochrome="cyan">ข้อถัดไป {">"}</flowbite_react_1.Button>)}
                    </div>
                </div>
            </div>
        </div>);
};
const CountdownTimer = ({ timeInMinute }) => {
    const [time, setTime] = (0, react_1.useState)(60 * timeInMinute); // Total time in seconds
    (0, react_1.useEffect)(() => {
        if (time > 0) {
            const timer = setTimeout(() => setTime(time - 1), 1000);
            return () => clearTimeout(timer);
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
const AnswerContainner = ({ question, index, selectedAnswer }) => {
    console.log("🚀 ~ AnswerContainner ~ question:", question);
    return (<div className="flex flex-col gap-4">
            <p className="text-bold font-semibold">{question.text}</p>
            <div className="flex flex-col gap-4">
                {question.choices.map((choice, index) => (<Choice key={`choices-${index}`} isSelected={selectedAnswer === choice.choice} index={index} choice={choice.choice} answer={choice.answer}/>))}
            </div>
        </div>);
};
const Choice = ({ index, choice, answer, isSelected }) => {
    console.log("🚀 ~ Choice ~ isSelected:", answer, isSelected);
    return (<div className={`flex items-center ${isSelected ? 'bg-[#0ad2f633]' : 'bg-gray-100'} gap-2 p-5 rounded-lg`}>
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
exports.default = CourseQuizCheck;
