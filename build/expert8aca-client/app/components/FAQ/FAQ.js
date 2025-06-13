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
const layoutApi_1 = require("@/redux/features/layout/layoutApi");
const react_1 = __importStar(require("react"));
const hi_1 = require("react-icons/hi");
const FAQ = (props) => {
    const { data } = (0, layoutApi_1.useGetHeroDataQuery)("FAQ", {});
    const [activeQuestion, setActiveQuestion] = (0, react_1.useState)(null);
    const [questions, setQuestions] = (0, react_1.useState)([]);
    (0, react_1.useEffect)(() => {
        if (data) {
            setQuestions(data.layout?.faq);
        }
    }, [data]);
    const toggleQuestion = (id) => {
        setActiveQuestion(activeQuestion === id ? null : id);
    };
    return (<div className="w-full bg-gradient-4 text-white min-h-[80vh]">
      <div className="w-[90%] 800px:w-[80%] m-auto">
        <div className="pt-12">
          <dl className="space-y-8">
            {questions?.map((q) => (<div key={q.id} className={`${q._id !== questions[0]?._id && "border-t"} border-gray-200 pt-6`}>
                <dt className="text-lg">
                  <button className="flex items-start justify-between w-full text-left focus:outline-none" onClick={() => toggleQuestion(q._id)}>
                    <span className="font-medium text-white dark:text-white">
                      {q.question}
                    </span>
                    <span className="ml-6 flex-shrink-0">
                      {activeQuestion === q._id ? (<hi_1.HiMinus className="h-6 w-6 text-white dark:text-white"/>) : (<hi_1.HiPlus className="h-6 w-6 text-white dark:text-white"/>)}
                    </span>
                  </button>
                </dt>
                {activeQuestion === q._id && (<dd className="mt-2 pr-12">
                    <p className="text-base font-Poppins text-white dark:text-white">
                      {q.answer}
                    </p>
                  </dd>)}
              </div>))}
          </dl>
        </div>
      </div>
    </div>);
};
exports.default = FAQ;
