"use strict";
'use client';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const CourseDetailsPage_1 = __importDefault(require("../../components/Course/CourseDetailsPage"));
const Page = ({ params }) => {
    return (<div>
            <CourseDetailsPage_1.default id={params.id}/>
        </div>);
};
exports.default = Page;
