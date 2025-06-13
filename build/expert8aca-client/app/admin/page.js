"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Heading_1 = __importDefault(require("../utils/Heading"));
const AdminSidebar_1 = __importDefault(require("../components/Admin/sidebar/AdminSidebar"));
const adminProtected_1 = __importDefault(require("../hooks/adminProtected"));
const DashboardHero_1 = __importDefault(require("../components/Admin/DashboardHero"));
const page = (props) => {
    return (<div>
      <adminProtected_1.default>
        <Heading_1.default title="Elearning - Admin" description="ELearning is a platform for students to learn and get help from teachers" keywords="Programming,MERN,Redux,Machine Learning"/>
        <div className="flex min-h-screen">
          <div className="1500px:w-[16%] w-1/5">
            <AdminSidebar_1.default />
          </div>
          <div className="w-[85%]">
            <DashboardHero_1.default isDashboard={true}/>
          </div>
        </div>
      </adminProtected_1.default>
    </div>);
};
exports.default = page;
