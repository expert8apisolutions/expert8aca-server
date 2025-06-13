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
const style_1 = require("@/app/styles/style");
const react_1 = __importStar(require("react"));
const react_hot_toast_1 = require("react-hot-toast");
const flowbite_react_1 = require("flowbite-react");
const quizApi_1 = require("@/redux/features/quiz/quizApi");
const CourseQuiz = ({ courseInfo, setCourseInfo, active, setActive, }) => {
    const [quizOptions, setQuizOptions] = (0, react_1.useState)([]);
    const { data: quizData, isLoading: quizLoading, error: quizError, } = (0, quizApi_1.useGetAllQuizQuery)(undefined, { refetchOnMountOrArgChange: true, });
    const quiz = courseInfo.quiz;
    (0, react_1.useEffect)(() => {
        if (quiz) {
        }
    }, []);
    (0, react_1.useEffect)(() => {
        if (quizData) {
            const options = quizData.quiz.map((quiz) => ({ title: quiz.name, value: quiz._id }));
            setQuizOptions(options);
        }
    }, [quizData]);
    const prevButton = () => {
        setActive(active - 1);
    };
    const handleOptions = () => {
        if (quiz.preTestEnabled) {
            if (quiz.preTestTitle === "") {
                react_hot_toast_1.toast.error("Please enter pre-test title!");
                return;
            }
            if (quiz.preTestId === "") {
                react_hot_toast_1.toast.error("Please select pre-test quiz!");
                return;
            }
        }
        if (quiz.postTestEnabled) {
            if (quiz.postTestTitle === "") {
                react_hot_toast_1.toast.error("Please enter post-test title!");
                return;
            }
            if (quiz.postTestId === "") {
                react_hot_toast_1.toast.error("Please select post-test quiz!");
                return;
            }
        }
        setActive(active + 1);
    };
    const handleQuizChange = (name, value) => {
        setCourseInfo((prev) => ({
            ...prev,
            quiz: {
                ...prev.quiz,
                [name]: value,
            },
        }));
    };
    return (<div className="w-[80%] m-auto mt-24 block">
            <div>
                <label className={`${style_1.styles.label} text-[20px]`} htmlFor="email">
                    Quiz
                </label>
                <br />
            </div>
            <div className="mt-[20px] mb-5">
                <flowbite_react_1.ToggleSwitch sizing={'lg'} checked={quiz.preTestEnabled} label="Pre-test" onChange={(value) => handleQuizChange('preTestEnabled', value)}/>
            </div>
            {quiz.preTestEnabled && (<div>
                        <label className={`${style_1.styles.label} text-[18px] mt-5`}>
                            Pre-test Title
                        </label>
                        <br />
                        <input type="text" name="preTestTitle" placeholder="แบบทดสอบก่อนเรียน" required className={`${style_1.styles.input} my-2`} value={quiz.preTestTitle} onChange={({ target: { value } }) => handleQuizChange('preTestTitle', value)}/>
                        <div>
                            <label className={`${style_1.styles.label} text-[18px] mt-1`}>
                                Select Quiz
                            </label>
                            <br />
                            <SelectQuiz quizOptions={quizOptions} setQuizSelected={(value) => handleQuizChange('preTestId', value)} quizSelected={quiz.preTestId}/>
                        </div>
                    </div>)}

            <div className="mt-[40px] mb-5">
                <flowbite_react_1.ToggleSwitch sizing={'lg'} checked={quiz.postTestEnabled} label="Post-test" onChange={(value) => handleQuizChange('postTestEnabled', value)}/>
            </div>
            {quiz.postTestEnabled && (<div>
                        <label className={`${style_1.styles.label} text-[18px] mt-5`}>
                            Post-test Title
                        </label>
                        <br />
                        <input type="text" name="postTestTitle" placeholder="แบบทดสอบหลังเรียน" required className={`${style_1.styles.input} my-2`} value={quiz.postTestTitle} onChange={({ target: { value } }) => handleQuizChange('postTestTitle', value)}/>
                        <div>
                            <label className={`${style_1.styles.label} text-[18px] mt-1`}>
                                Select Quiz
                            </label>
                            <br />
                            <SelectQuiz quizOptions={quizOptions} setQuizSelected={(value) => handleQuizChange('postTestId', value)} quizSelected={quiz.postTestId}/>
                        </div>
                    </div>)}

            <SelectCert setCourseInfo={setCourseInfo} courseInfo={courseInfo}/>

            <div className="w-full flex items-center justify-between">
                <div className="w-full 800px:w-[180px] flex items-center justify-center h-[40px] bg-[#37a39a] text-center text-[#fff] rounded mt-8 cursor-pointer" onClick={() => prevButton()}>
                    Prev
                </div>
                <div className="w-full 800px:w-[180px] flex items-center justify-center h-[40px] bg-[#37a39a] text-center text-[#fff] rounded mt-8 cursor-pointer" onClick={() => handleOptions()}>
                    Next
                </div>
            </div>
        </div>);
};
const SelectCert = ({ courseInfo, setCourseInfo }) => {
    const optionList = [
        { title: 'Inactive certificate', value: '' },
        { title: 'PostTest', value: 'PostTest' },
        { title: 'Process', value: 'Process' },
        { title: 'PostTest or Process', value: 'PostTest or Process' },
    ];
    return (<>
            <div className={`${style_1.styles.label} mt-1`}>Certificate Option</div>
            <select value={courseInfo?.certificate || ''} className="w-full text-black" onChange={(event) => {
            setCourseInfo((prev) => ({
                ...prev,
                certificate: event.target.value,
            }));
        }}>
                {optionList.map((option) => (<option value={option.value}>{option.title}</option>))}

            </select>
        </>);
};
const SelectQuiz = ({ quizOptions, setQuizSelected, quizSelected }) => {
    return (<select value={quizSelected} className="w-full text-black" onChange={(event) => {
            setQuizSelected(event.target.value);
        }}>
            <option value="">Select Quiz</option>
            {quizOptions.map((option) => (<option value={option.value}>{option.title}</option>))}
        </select>);
};
exports.default = CourseQuiz;
