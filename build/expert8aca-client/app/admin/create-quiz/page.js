"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const QuizPage_1 = __importDefault(require("./components/QuizPage"));
const page = () => {
    return (<div className=''>
      <div className='w-[900px]'>
        <QuizPage_1.default />
      </div>
    </div>);
};
exports.default = page;
