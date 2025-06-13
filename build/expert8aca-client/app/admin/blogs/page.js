"use strict";
'use client';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DashboardHero_1 = __importDefault(require("@/app/components/Admin/DashboardHero"));
const adminProtected_1 = __importDefault(require("@/app/hooks/adminProtected"));
const Heading_1 = __importDefault(require("@/app/utils/Heading"));
const react_1 = __importDefault(require("react"));
const AdminSidebar_1 = __importDefault(require("../../components/Admin/sidebar/AdminSidebar"));
const AllBlog_1 = __importDefault(require("@/app/components/Admin/Blog/AllBlog"));
const page = (props) => {
    return (<div>
      <adminProtected_1.default>
        <Heading_1.default title="Elearning - Admin" description="ELearning is a platform for students to learn and get help from teachers" keywords="Programming,MERN,Redux,Machine Learning"/>
        <div className="flex min-h-screen">
          <div className="1500px:w-[16%] w-1/5">
            <AdminSidebar_1.default />
          </div>
          <div className="w-[85%]">
            <DashboardHero_1.default />
            {/* <BlogInformation /> */}
            <AllBlog_1.default />
          </div>
        </div>
      </adminProtected_1.default>
    </div>);
};
exports.default = page;
