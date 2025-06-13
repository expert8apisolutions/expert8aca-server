"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const flowbite_react_1 = require("flowbite-react");
const navigation_1 = require("next/navigation");
const quizApi_1 = require("@/redux/features/quiz/quizApi");
const react_1 = require("react");
const ci_1 = require("react-icons/ci");
const react_hot_toast_1 = __importDefault(require("react-hot-toast"));
const DialogDeleteConfirm_1 = require("@/app/admin/upload/component/DialogDeleteConfirm");
const QuizPage = () => {
    const router = (0, navigation_1.useRouter)();
    const { data: quizResponse, refetch } = (0, quizApi_1.useGetAllQuizQuery)({ refetchOnMountOrArgChange: true });
    const [deleteQuiz,] = (0, quizApi_1.useDeleteQuizMutation)();
    const [dataList, setDataList] = (0, react_1.useState)([]);
    const [openModalDel, setOpenModalDel] = (0, react_1.useState)(false);
    const [selectDelId, setSelectDelId] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        if (quizResponse) {
            // console.log("🚀 ~ useEffect ~ quizResponse:", quizResponse.quiz)
            setDataList(quizResponse.quiz);
        }
    }, [quizResponse]);
    const handleDelQuiz = (quizId) => {
        if (!quizId)
            return;
        react_hot_toast_1.default.promise(deleteQuiz(quizId).unwrap().then(() => {
            setOpenModalDel(false);
            refetch();
        }), {
            loading: 'Deleting...',
            success: 'Deleted successfully',
            error: 'Failed to delete'
        });
        console.log("🚀 ~ handleDelQuiz ~ idx", quizId);
    };
    return (<div>

            <div className="w-full flex justify-end text-black">
                <flowbite_react_1.Button color="info" onClick={() => router.push('/admin/create-quiz/add')}>+ Create quiz</flowbite_react_1.Button>
            </div>
            <div className="overflow-x-auto mt-3">
                <flowbite_react_1.Table hoverable>
                    <flowbite_react_1.Table.Head>
                        <flowbite_react_1.Table.HeadCell>Name</flowbite_react_1.Table.HeadCell>
                        <flowbite_react_1.Table.HeadCell>Total question</flowbite_react_1.Table.HeadCell>
                        <flowbite_react_1.Table.HeadCell>Pass percentage</flowbite_react_1.Table.HeadCell>
                        <flowbite_react_1.Table.HeadCell>
                            <span className="sr-only">Edit</span>
                        </flowbite_react_1.Table.HeadCell>
                    </flowbite_react_1.Table.Head>
                    <flowbite_react_1.Table.Body className="divide-y">
                        {dataList.map((item, index) => (<flowbite_react_1.Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <flowbite_react_1.Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                        {item.name}
                                    </flowbite_react_1.Table.Cell>
                                    <flowbite_react_1.Table.Cell>{item.quizItemCount}</flowbite_react_1.Table.Cell>
                                    <flowbite_react_1.Table.Cell>{item.pass_percentage}%</flowbite_react_1.Table.Cell>
                                    <flowbite_react_1.Table.Cell className="flex justify-end gap-2">
                                        <button onClick={() => router.push(`/admin/create-quiz/${item._id}`)}><ci_1.CiEdit className=' hover:scale-110' size={22}/></button>
                                        <button onClick={() => {
                setSelectDelId(item._id);
                setOpenModalDel(true);
            }}><ci_1.CiTrash className=' hover:scale-110' size={22}/></button>
                                    </flowbite_react_1.Table.Cell>
                                </flowbite_react_1.Table.Row>))}
                    </flowbite_react_1.Table.Body>
                </flowbite_react_1.Table>
                {openModalDel && <DialogDeleteConfirm_1.DialogDeleteConfirm openModal={openModalDel} onClose={() => { setOpenModalDel(false); }} onConfirm={() => { handleDelQuiz(selectDelId || ''); }}/>}
            </div>
        </div>);
};
exports.default = QuizPage;
