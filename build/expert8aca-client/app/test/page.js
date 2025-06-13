"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const S3Uploader_1 = __importDefault(require("./S3Uploader"));
const page = () => {
    return (<div>
            <S3Uploader_1.default />
        </div>);
};
exports.default = page;
