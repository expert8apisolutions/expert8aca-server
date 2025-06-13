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
// import QuizPage from './components/QuizPage'
const flowbite_react_1 = require("flowbite-react");
const flowbite_react_2 = require("flowbite-react");
const quizApi_1 = require("@/redux/features/quiz/quizApi");
const flowbite_react_3 = require("flowbite-react");
const axios_1 = __importDefault(require("axios"));
const dateFomat_1 = require("@/app/utils/dateFomat");
const last30Days = new Date();
last30Days.setDate(last30Days.getDate() - 30);
const page = () => {
    const { data: quizResponse } = (0, quizApi_1.useGetAllQuizQuery)({
        refetchOnMountOrArgChange: true,
    });
    const [quizOptions, setQuizOptions] = (0, react_1.useState)([]);
    const [currentPage, setCurrentPage] = (0, react_1.useState)(1);
    const [selectedQuiz, setSelectedQuiz] = (0, react_1.useState)("");
    const [dataTable, setDataTable] = (0, react_1.useState)([]);
    const [selectedQuizType, setSelectedQuizType] = (0, react_1.useState)("pre-test");
    const [selectedQuizObject, setSelectedQuizObject] = (0, react_1.useState)({});
    const [responseQuizReport, setResponseQuizReport] = (0, react_1.useState)({});
    const [formDate, setFormDate] = (0, react_1.useState)(last30Days);
    console.log("🚀 ~ page ~ formDate:", formDate);
    const [toDate, setToDate] = (0, react_1.useState)('');
    const onPageChange = (page) => setCurrentPage(page);
    (0, react_1.useEffect)(() => {
        if (quizResponse?.quiz?.length) {
            const quizOptions = quizResponse.quiz.map((quiz) => {
                return { label: quiz.name, value: quiz._id };
            });
            setQuizOptions(quizOptions);
        }
    }, [quizResponse]);
    (0, react_1.useEffect)(() => {
        if (quizOptions.length) {
            setSelectedQuiz(quizOptions[0].value);
            const selectedQuizObject = quizResponse.quiz.find((quiz) => quiz._id === quizOptions[0].value);
            setSelectedQuizObject(selectedQuizObject);
        }
    }, [quizOptions]);
    (0, react_1.useEffect)(() => {
        if (selectedQuiz) {
            fetchQuizReport();
        }
    }, [selectedQuiz]);
    const fetchQuizReport = () => {
        axios_1.default
            .get("/api/v1/admin/quiz-report", {
            params: {
                quiz_id: selectedQuiz,
            },
        })
            .then((res) => {
            if (res.data?.result?.length) {
                const tableList = res.data.result.map((item) => {
                    const isPretest = selectedQuizType === "pre-test";
                    const selected_key = isPretest ? "pre_test" : "post_test";
                    return {
                        name: item.user[0].name,
                        score: item[`${selected_key}_score`],
                        status: item[`${selected_key}_passed`],
                        lastSubmitDate: item[`${selected_key}_last_submit_date`],
                        totalSubmit: item[`${selected_key}_count`],
                    };
                });
                setDataTable(tableList);
                setResponseQuizReport(res.data.result);
            }
            else {
                setDataTable([]);
                setResponseQuizReport([]);
            }
        });
    };
    (0, react_1.useEffect)(() => {
        if (responseQuizReport.length) {
            const tableList = responseQuizReport.map((item) => {
                const isPretest = selectedQuizType === "pre-test";
                const selected_key = isPretest ? "pre_test" : "post_test";
                return {
                    name: item.user[0].name,
                    score: item[`${selected_key}_score`],
                    status: item[`${selected_key}_passed`],
                    lastSubmitDate: item[`${selected_key}_last_submit_date`],
                    totalSubmit: item[`${selected_key}_count`],
                };
            });
            setDataTable(tableList);
        }
        else {
            setDataTable([]);
        }
    }, [selectedQuizType]);
    const totalData = dataTable.length;
    const dataPerPage = 10;
    const totalPage = Math.ceil(totalData / dataPerPage);
    const getPaginationData = () => {
        const start = (currentPage - 1) * dataPerPage;
        const end = start + dataPerPage;
        return dataTable?.slice?.(start, end) || [];
    };
    const getSummarize = (0, react_1.useMemo)(() => {
        const dataList = dataTable;
        const total = dataList.length;
        const passed = dataList.filter((item) => item.status).length;
        const failed = total - passed;
        const avgScore = dataList.reduce((acc, item) => acc + item.score, 0) / total;
        return {
            total,
            passed,
            failed,
            avgScore,
        };
    }, [dataTable]);
    return (<div className="w-[900px]">
      <div className="flex gap-4 mb-5">
        <div className="grid grid-cols-2 w-full gap-4">
          <div className="max-w-md">
            <div className="mb-2 block">
              <flowbite_react_1.Label htmlFor="quizType" value="Quiz Type"/>
            </div>
            <flowbite_react_1.Select id="quizType" required value={selectedQuizType} onChange={(e) => setSelectedQuizType(e.target.value)}>
              <option value={"pre-test"}>Pre Test</option>
              <option value={"post-test"}>Post Test</option>
            </flowbite_react_1.Select>
          </div>
          <div className="max-w-md">
            <div className="mb-2 block">
              <flowbite_react_1.Label htmlFor="quiz" value="Select Quiz"/>
            </div>
            <flowbite_react_1.Select id="quiz" required value={selectedQuiz} onChange={(e) => setSelectedQuiz(e.target.value)}>
              {quizOptions.map((quiz) => {
            return (<option key={quiz.value} value={quiz.value}>
                    {quiz.label}
                  </option>);
        })}
            </flowbite_react_1.Select>
          </div>
        </div>
        {/* <div className='grid grid-cols-2 w-full gap-4'>
          <div className="max-w-md">
            <div className="mb-2 block">
              <Label htmlFor="formDate" value="from date" />
            </div>
            <Datepicker
              id='formDate'
              language='th'
              value={formDate.toISOString()}
            />
          </div>
          <div className="max-w-md">
            <div className="mb-2 block">
              <Label htmlFor="toDate" value="to date" />
            </div>
            <Datepicker
              id='toDate'
              language='th'
            />
          </div>
        </div> */}
      </div>

      <div>
        <div>
          <div className="flex justify-end text-black">
            <div>
              <div className="flex gap-4">
                <div className="text-sm">
                  <p>Total: {getSummarize.total}</p>
                  <p>Passed: {getSummarize.passed}</p>
                  <p>Failed: {getSummarize.failed}</p>
                  <p>Avg Score: {getSummarize.avgScore.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <flowbite_react_2.Table hoverable>
            <flowbite_react_2.Table.Head>
              <flowbite_react_2.Table.HeadCell>No</flowbite_react_2.Table.HeadCell>
              <flowbite_react_2.Table.HeadCell>Name</flowbite_react_2.Table.HeadCell>
              <flowbite_react_2.Table.HeadCell>Score</flowbite_react_2.Table.HeadCell>
              <flowbite_react_2.Table.HeadCell>Status</flowbite_react_2.Table.HeadCell>
              <flowbite_react_2.Table.HeadCell>Last Submit Date</flowbite_react_2.Table.HeadCell>
              <flowbite_react_2.Table.HeadCell>Total Submit</flowbite_react_2.Table.HeadCell>
            </flowbite_react_2.Table.Head>
            <flowbite_react_2.Table.Body className="divide-y">
              {getPaginationData().map((item, index) => (<flowbite_react_2.Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <flowbite_react_2.Table.Cell>
                    {+dataPerPage * (currentPage - 1) + (index + 1)}
                  </flowbite_react_2.Table.Cell>
                  <flowbite_react_2.Table.Cell>{item.name}</flowbite_react_2.Table.Cell>
                  <flowbite_react_2.Table.Cell>
                    {item.score}/{selectedQuizObject?.quizItemCount}
                  </flowbite_react_2.Table.Cell>
                  <flowbite_react_2.Table.Cell className={`${item.status ? "text-green-500" : "text-red-500"}`}>
                    {item.status ? "Passed" : "Failed"}
                  </flowbite_react_2.Table.Cell>
                  <flowbite_react_2.Table.Cell>
                    {(0, dateFomat_1.DateShortTHAndTime)(new Date(item.lastSubmitDate))}
                  </flowbite_react_2.Table.Cell>
                  <flowbite_react_2.Table.Cell>{item.totalSubmit}</flowbite_react_2.Table.Cell>
                </flowbite_react_2.Table.Row>))}
            </flowbite_react_2.Table.Body>
          </flowbite_react_2.Table>
        </div>
        <div className="flex overflow-x-auto sm:justify-center mt-5">
          <flowbite_react_3.Pagination currentPage={currentPage} totalPages={totalPage} onPageChange={onPageChange}/>
        </div>
      </div>
    </div>);
};
exports.default = page;
