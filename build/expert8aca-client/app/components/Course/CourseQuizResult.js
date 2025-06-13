"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const flowbite_react_1 = require("flowbite-react");
const react_1 = __importDefault(require("react"));
const io_1 = require("react-icons/io");
const flowbite_react_2 = require("flowbite-react");
const dateFomat_1 = require("@/app/utils/dateFomat");
const rx_1 = require("react-icons/rx");
const bi_1 = require("react-icons/bi");
const CourseQuizResult = ({ isPassed, score, totalScore, onCheckAnswer, onReQuiz, title, histoyList, maxSubmit, }) => {
    console.log("🚀 ~ histoyList:", histoyList);
    return (<div className='flex justify-center flex-col items-center'>
			<h1 className='text-2xl'>ผลของการทดสอบ</h1>
			<h1 className='text-xl mt-2'>{title}</h1>
			<div className='flex justify-center flex-col items-center mt-5'>
				{isPassed ? <PassIcon /> : <FailIcon />}
			</div>
			<div className='flex justify-between items-center flex-col mt-4'>
				<p>คะแนนที่ได้: <span className=' font-bold'>{score}</span> /  {totalScore}</p>
				<div className="overflow-x-auto mt-2">
					<flowbite_react_2.Table>
						<flowbite_react_2.Table.Head>
							<flowbite_react_2.Table.HeadCell>ครั้งที่</flowbite_react_2.Table.HeadCell>
							<flowbite_react_2.Table.HeadCell>วันที่</flowbite_react_2.Table.HeadCell>
							<flowbite_react_2.Table.HeadCell>คะเเนน</flowbite_react_2.Table.HeadCell>
							<flowbite_react_2.Table.HeadCell>สถานะ</flowbite_react_2.Table.HeadCell>
							<flowbite_react_2.Table.HeadCell>เวลาที่ใช้</flowbite_react_2.Table.HeadCell>
						</flowbite_react_2.Table.Head>
						<flowbite_react_2.Table.Body className="divide-y">
							{histoyList.map((item, index) => (<flowbite_react_2.Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
										<flowbite_react_2.Table.Cell>{index + 1}</flowbite_react_2.Table.Cell>
										<flowbite_react_2.Table.Cell>{(0, dateFomat_1.DateShortTHAndTime)(item.submit_date)}</flowbite_react_2.Table.Cell>
										<flowbite_react_2.Table.Cell>{item.score}</flowbite_react_2.Table.Cell>
										<flowbite_react_2.Table.Cell>{item.isPassed ? 'ผ่าน' : 'ไม่ผ่าน'}</flowbite_react_2.Table.Cell>
										<flowbite_react_2.Table.Cell>{(0, dateFomat_1.DiffBetweenDateWithLabel)(item.submit_date, item.start_date)}</flowbite_react_2.Table.Cell>
									</flowbite_react_2.Table.Row>))}
						</flowbite_react_2.Table.Body>
					</flowbite_react_2.Table>
				</div>
				<div className='flex justify-center gap-5 mt-10'>
					<flowbite_react_1.Button color="gray" onClick={onCheckAnswer}><bi_1.BiListCheck size={16} className='mr-1'/>ตรวจสอบคำตอบ</flowbite_react_1.Button>
					{!isPassed && <flowbite_react_1.Button disabled={histoyList.length >= maxSubmit} onClick={onReQuiz}>
							<bi_1.BiRevision size={16} className='mr-2'/>
							ทดสอบใหม่อีกครั้ง (
							{histoyList.length}/{maxSubmit}
							)
						</flowbite_react_1.Button>}
				</div>
			</div>
		</div>);
};
const PassIcon = () => {
    return (<>
			<io_1.IoMdCheckmarkCircleOutline size={99} className='text-9xl text-green-500'/>
			<p className='text-xl text-green-500 font-bold'>ผ่าน</p>
		</>);
};
const FailIcon = () => {
    return (<>
			<rx_1.RxCrossCircled size={99} className='text-9xl text-red-500'/>
			<p className='text-xl text-red-500 font-bold'>ไม่ผ่าน</p>
		</>);
};
exports.default = CourseQuizResult;
