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
const style_1 = require("@/app/styles/style");
const layoutApi_1 = require("@/redux/features/layout/layoutApi");
const react_1 = __importStar(require("react"));
const react_hot_toast_1 = require("react-hot-toast");
const ai_1 = require("react-icons/ai");
const hi_1 = require("react-icons/hi");
const io_1 = require("react-icons/io");
const Loader_1 = __importDefault(require("../../Loader/Loader"));
const EditFaq = (props) => {
    const { data, isLoading } = (0, layoutApi_1.useGetHeroDataQuery)("FAQ", {
        refetchOnMountOrArgChange: true,
    });
    const [editLayout, { isSuccess: layoutSuccess, error }] = (0, layoutApi_1.useEditLayoutMutation)();
    const [questions, setQuestions] = (0, react_1.useState)([]);
    (0, react_1.useEffect)(() => {
        if (data) {
            setQuestions(data.layout.faq);
        }
        if (layoutSuccess) {
            react_hot_toast_1.toast.success("FAQ updated successfully");
        }
        if (error) {
            if ("data" in error) {
                const errorData = error;
                react_hot_toast_1.toast.error(errorData?.data?.message);
            }
        }
    }, [data, layoutSuccess, error]);
    const toggleQuestion = (id) => {
        setQuestions((prevQuestions) => prevQuestions.map((q) => (q._id === id ? { ...q, active: !q.active } : q)));
    };
    const handleQuestionChange = (id, value) => {
        setQuestions((prevQuestions) => prevQuestions.map((q) => (q._id === id ? { ...q, question: value } : q)));
    };
    const handleAnswerChange = (id, value) => {
        setQuestions((prevQuestions) => prevQuestions.map((q) => (q._id === id ? { ...q, answer: value } : q)));
    };
    const newFaqHandler = () => {
        setQuestions([
            ...questions,
            {
                question: "",
                answer: "",
            },
        ]);
    };
    // Function to check if the FAQ arrays are unchanged
    const areQuestionsUnchanged = (originalQuestions, newQuestions) => {
        return JSON.stringify(originalQuestions) === JSON.stringify(newQuestions);
    };
    const isAnyQuestionEmpty = (questions) => {
        return questions.some((q) => q.question === "" || q.answer === "");
    };
    const handleEdit = async () => {
        if (!areQuestionsUnchanged(data.layout.faq, questions) &&
            !isAnyQuestionEmpty(questions)) {
            await editLayout({
                type: "FAQ",
                faq: questions,
            });
        }
    };
    return (<>
   {isLoading ? (<Loader_1.default />) : (<div className="w-[90%] 800px:w-[80%] m-auto mt-[120px]">
        <div className="mt-12">
          <dl className="space-y-8">
            {questions.map((q) => (<div key={q._id} className={`${q._id !== questions[0]?._id && "border-t"} border-gray-200 pt-6`}>
                <dt className="text-lg">
                  <button className="flex items-start dark:text-white text-black justify-between w-full text-left focus:outline-none" onClick={() => toggleQuestion(q._id)}>
                    <input className={`${style_1.styles.input} border-none`} value={q.question} onChange={(e) => handleQuestionChange(q._id, e.target.value)} placeholder={"Add your question..."}/>
  
                    <span className="ml-6 flex-shrink-0">
                      {q.active ? (<hi_1.HiMinus className="h-6 w-6"/>) : (<hi_1.HiPlus className="h-6 w-6"/>)}
                    </span>
                  </button>
                </dt>
                {q.active && (<dd className="mt-2 pr-12">
                    <input className={`${style_1.styles.input} border-none`} value={q.answer} onChange={(e) => handleAnswerChange(q._id, e.target.value)} placeholder={"Add your answer..."}/>
                    <span className="ml-6 flex-shrink-0">
                      <ai_1.AiOutlineDelete className="dark:text-white text-black text-[18px] cursor-pointer" onClick={() => {
                        setQuestions((prevQuestions) => prevQuestions.filter((item) => item._id !== q._id));
                    }}/>
                    </span>
                  </dd>)}
              </div>))}
          </dl>
          <br />
          <br />
          <io_1.IoMdAddCircleOutline className="dark:text-white text-black text-[25px] cursor-pointer" onClick={newFaqHandler}/>
        </div>
  
        <div className={`${style_1.styles.button} !w-[100px] !min-h-[40px] !h-[40px] dark:text-white text-black bg-[#cccccc34] 
              ${areQuestionsUnchanged(data.layout.faq, questions) ||
                isAnyQuestionEmpty(questions)
                ? "!cursor-not-allowed"
                : "!cursor-pointer !bg-[#42d383]"}
              !rounded fixed bottom-12 right-12`} onClick={areQuestionsUnchanged(data.layout.faq, questions) ||
                isAnyQuestionEmpty(questions)
                ? () => null
                : handleEdit}>
          Save
        </div>
      </div>)}
   </>);
};
exports.default = EditFaq;
