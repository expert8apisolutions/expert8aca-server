"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const image_1 = __importDefault(require("next/image"));
const react_1 = __importDefault(require("react"));
const avatar_png_1 = __importDefault(require("../../../public/assests/avatar.png"));
const ri_1 = require("react-icons/ri");
const si_1 = require("react-icons/si");
const ai_1 = require("react-icons/ai");
const md_1 = require("react-icons/md");
const link_1 = __importDefault(require("next/link"));
const SideBarProfile = ({ user, active, avatar, setActive, logOutHandler, }) => {
    return (<div className="w-full">
      <div className={`w-full flex items-center px-3 py-4 cursor-pointer ${active === 1 ? "dark:bg-slate-800 bg-white" : "bg-transparent"}`} onClick={() => setActive(1)}>
        <image_1.default src={user.avatar || avatar ? user.avatar.url || avatar : avatar_png_1.default} alt="" width={20} height={20} className="w-[20px] h-[20px] 800px:w-[30px] 800px:h-[30px] cursor-pointer rounded-full"/>
        <h5 className="pl-2 800px:block hidden font-Poppins dark:text-white text-black">
          My Account
        </h5>
      </div>
      <div className={`w-full flex items-center px-3 py-4 cursor-pointer ${active === 2 ? "dark:bg-slate-800 bg-white" : "bg-transparent"}`} onClick={() => setActive(2)}>
        <ri_1.RiLockPasswordLine size={20} className="dark:text-white text-black"/>
        <h5 className="pl-2 800px:block hidden font-Poppins dark:text-white text-black">
          Change Password
        </h5>
      </div>
      <div className={`w-full flex items-center px-3 py-4 cursor-pointer ${active === 3 ? "dark:bg-slate-800 bg-white" : "bg-transparent"}`} onClick={() => setActive(3)}>
        <si_1.SiCoursera size={20} className="dark:text-white text-black"/>
        <h5 className="pl-2 800px:block hidden font-Poppins dark:text-white text-black">
          Enrolled Courses
        </h5>
      </div>
      <div className={`w-full flex items-center px-3 py-4 cursor-pointer ${active === 4 ? "dark:bg-slate-800 bg-white" : "bg-transparent"}`} onClick={() => setActive(4)}>
        <ai_1.AiOutlineFilePpt size={20} className="dark:text-white text-black"/>
        <h5 className="pl-2 800px:block hidden font-Poppins dark:text-white text-black">
          Enrolled Ebook
        </h5>
      </div>
      {user.role === "admin" && (<link_1.default className={`w-full flex items-center px-3 py-4 cursor-pointer ${active === 5 ? "dark:bg-slate-800 bg-white" : "bg-transparent"}`} href={"/admin"}>
          <md_1.MdOutlineAdminPanelSettings size={20} className="dark:text-white text-black"/>
          <h5 className="pl-2 800px:block hidden font-Poppins dark:text-white text-black">
            Admin Dashboard
          </h5>
        </link_1.default>)}
      <div className={`w-full flex items-center px-3 py-4 cursor-pointer ${active === 6 ? "dark:bg-slate-800 bg-white" : "bg-transparent"}`} onClick={() => logOutHandler()}>
        <ai_1.AiOutlineLogout size={20} className="dark:text-white text-black"/>
        <h5 className="pl-2 800px:block hidden font-Poppins dark:text-white text-black">
          Log Out
        </h5>
      </div>
    </div>);
};
exports.default = SideBarProfile;
