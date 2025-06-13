"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
require("./Loader.css");
const LoadingBackDrop = () => {
    return (<div className="flex justify-center items-center h-screen loadingBlackDrop">
      <div className="loader"></div>
    </div>);
};
exports.default = LoadingBackDrop;
