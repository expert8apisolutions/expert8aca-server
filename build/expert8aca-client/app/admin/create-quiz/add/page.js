"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const QuizDetailContainner_1 = __importDefault(require("../components/QuizDetailContainner"));
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
const page = () => {
    return (<div>
      <QuizDetailContainner_1.default quizId={undefined}/>
    </div>);
};
exports.default = page;
