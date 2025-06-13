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
const flowbite_react_1 = require("flowbite-react");
const navigation_1 = require("next/navigation");
const react_1 = __importStar(require("react"));
const QuizInputForm_1 = __importDefault(require("./QuizInputForm"));
const DialogAddEditQuestion_1 = __importDefault(require("./DialogAddEditQuestion"));
const ci_1 = require("react-icons/ci");
const quizApi_1 = require("@/redux/features/quiz/quizApi");
const react_hot_toast_1 = __importDefault(require("react-hot-toast"));
const initialItems = [
// {
//   question: "ถ้าต้องการย้อนการเปลี่ยนแปลง commit ก่อนหน้า โดยไม่เปลี่ยนแปลงประวัติการ commit จะใช้คำสั่งอะไร",
//   description: "vdfvdf",
//   image: null,
//   choices: [
//     { choice: "A", answer: "git revert", image: null },
//     { choice: "B", answer: "git forward", image: null },
//     { choice: "C", answer: "git rollback", image: null },
//     { choice: "D", answer: "git reflog", image: null },
//   ],
//   answer: "D",
// },
];
const QuizDetailContainner = ({ quizId }) => {
    const router = (0, navigation_1.useRouter)();
    const [openModal, setOpenModal] = (0, react_1.useState)({
        isOpen: false,
        data: undefined,
    });
    const [items, setItems] = (0, react_1.useState)([]);
    console.log("🚀 ~ QuizDetailContainner ~ openModal:", openModal);
    const { refetch: refreshAllQuiz } = (0, quizApi_1.useGetAllQuizQuery)({
        refetchOnMountOrArgChange: true,
    });
    const { data: quizData } = (0, quizApi_1.useGetQuizByIdQuery)(quizId, {
        refetchOnMountOrArgChange: true,
    });
    const [parentItems, setParentItems] = (0, react_1.useState)(initialItems);
    const [state, setState] = (0, react_1.useState)({
        name: "",
        description: "",
        passPercentage: 80,
        maxSubmissionPreTest: 10,
        maxSubmissionPostTest: 10,
        timeLimitMinutes: 90,
        isCheckTotalTime: true,
    });
    const [createQuiz] = (0, quizApi_1.useCreateQuizMutation)();
    const [updateQuiz] = (0, quizApi_1.useUpdateQuizMutation)();
    const isEdit = quizId !== undefined;
    (0, react_1.useEffect)(() => {
        console.log("🚀 ~ useEffect ~ quizId mounted");
    }, []);
    (0, react_1.useEffect)(() => {
        if (quizData) {
            const { name, description, pass_percentage, max_submission_pre_test, max_submission_post_test, quizItem, time_limit_minutes, } = quizData.quiz;
            setState({
                name,
                description,
                passPercentage: pass_percentage,
                maxSubmissionPreTest: max_submission_pre_test,
                maxSubmissionPostTest: max_submission_post_test,
                timeLimitMinutes: time_limit_minutes,
                isCheckTotalTime: (time_limit_minutes > 0),
            });
            setItems(quizItem);
            console.log("🚀 ~ useEffect ~ quizData:", quizData);
            // fetch quiz by id
        }
    }, [quizData]);
    const callbackDragEndItem = (items) => {
        setItems(items);
    };
    const handleAddQuizItem = (item) => {
        if (openModal.currentIndex !== undefined) {
            const newItem = [...items];
            newItem[openModal.currentIndex] = item;
            setItems(newItem);
            handleCloseModal();
            return;
        }
        setItems([...items, item]);
        handleCloseModal();
    };
    const handleEdit = (index) => {
        const selectQuestion = items.find((ele, idx) => idx === index);
        console.log("🚀 ~ handleEdit ~ selectQuestion:", selectQuestion);
        setOpenModal({
            isOpen: true,
            data: selectQuestion,
            currentIndex: index,
        });
    };
    const handleDelete = (index) => {
        console.log("🚀 ~ handleDelete ~ index:", index);
        const newItem = items.filter((ele, idx) => idx !== index);
        console.log("🚀 ~ handleDelete ~ newItem:", newItem);
        if (newItem.length === 0) {
            return setItems([]);
        }
        setItems([...newItem]);
    };
    const handleCloseModal = () => {
        setOpenModal({
            isOpen: false,
            data: undefined,
        });
    };
    const handleSave = async () => {
        if (!state.name) {
            return react_hot_toast_1.default.error("Please enter quiz name");
        }
        const payloadBody = {
            name: state.name,
            description: state.description,
            pass_percentage: state.passPercentage,
            max_submission_pre_test: state.maxSubmissionPreTest,
            max_submission_post_test: state.maxSubmissionPostTest,
            time_limit_minutes: state.timeLimitMinutes,
            quizItem: items.map((item) => ({
                question: item.question,
                description: item.description,
                image: item.image,
                image_base64: item.image_base64,
                image_link: item.image_link,
                choices: item.choices.map((choice) => ({
                    choice: choice.choice,
                    answer: choice.answer,
                    type: "text",
                    image: choice.image,
                })),
                answer: item.answer,
            })),
        };
        if (isEdit) {
            // update quiz
            return react_hot_toast_1.default.promise(updateQuiz({ body: payloadBody, quizId: quizData.quiz._id })
                .unwrap()
                .then((res) => {
                refreshAllQuiz();
            }), {
                loading: "Updating...",
                success: "Update success",
                error: "Update quiz failed",
            });
        }
        react_hot_toast_1.default.promise(createQuiz(payloadBody)
            .unwrap()
            .then((res) => {
            refreshAllQuiz();
            router.push("/admin/create-quiz");
        }), {
            loading: "Creating...",
            success: "Create success",
            error: "Create quiz failed",
        });
    };
    const handleClickAddQuizItem = () => {
        setOpenModal({
            isOpen: true,
            data: undefined,
        });
    };
    const lengthQuizItem = items.length;
    return (<div>
            <div className="text-black min-w-[900px] mt-[40px]">
                <div className="w-full flex justify-between items-center">
                    <flowbite_react_1.Button onClick={() => router.back()} color="light">
                        {" "}
                        {"< "}Back
                    </flowbite_react_1.Button>

                    <flowbite_react_1.Button onClick={handleClickAddQuizItem} gradientMonochrome="lime">
                        + Add Question
                    </flowbite_react_1.Button>
                </div>
                <div>
                    <QuizInputForm_1.default state={state} setState={setState} onEdit={handleEdit} onDelete={handleDelete} callBack={callbackDragEndItem} items={items}/>
                </div>
                {openModal.isOpen && (<DialogAddEditQuestion_1.default data={openModal.data} currentIndex={openModal.currentIndex} onAdd={handleAddQuizItem} openModal={openModal.isOpen} onClose={handleCloseModal}/>)}
                <div className="flex justify-center mt-10">
                    <flowbite_react_1.Button onClick={handleSave}>
                        <ci_1.CiFloppyDisk className="mr-2 h-5 w-5"/>
                        Save
                    </flowbite_react_1.Button>
                </div>
            </div>
        </div>);
};
exports.default = QuizDetailContainner;
