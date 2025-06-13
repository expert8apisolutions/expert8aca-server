"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const QuizDetailContainner_1 = __importDefault(require("../components/QuizDetailContainner"));
const page = ({ params }) => {
    console.log("🚀 ~ page ~ params:", params);
    return (<div>
            <QuizDetailContainner_1.default quizId={params.id}/>
        </div>);
};
exports.default = page;
