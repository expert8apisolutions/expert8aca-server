"use strict";
'use client';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const AdminSidebar_1 = __importDefault(require("../../components/Admin/sidebar/AdminSidebar"));
const Heading_1 = __importDefault(require("../../../app/utils/Heading"));
const CreateCourse_1 = __importDefault(require("../../components/Admin/Course/CreateCourse"));
const DashboardHeader_1 = __importDefault(require("../../../app/components/Admin/DashboardHeader"));
const page = (props) => {
    return (<div>
        <Heading_1.default title="Elearning - Admin" description="ELearning is a platform for students to learn and get help from teachers" keywords="Prograaming,MERN,Redux,Machine Learning"/>
        <div className="flex">
            <div className="1500px:w-[16%] w-1/5">
                <AdminSidebar_1.default />
            </div>
            <div className="w-[85%]">
               <DashboardHeader_1.default />
               <CreateCourse_1.default /> 
            </div>
        </div>
    </div>);
};
exports.default = page;
