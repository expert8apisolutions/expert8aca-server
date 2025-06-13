"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const style_1 = require("@/app/styles/style");
const userApi_1 = require("@/redux/features/user/userApi");
const react_1 = __importStar(require("react"));
const react_hot_toast_1 = require("react-hot-toast");
const ChangePassword = (props) => {
    const [oldPassword, setOldPassword] = (0, react_1.useState)("");
    const [newPassword, setNewPassword] = (0, react_1.useState)("");
    const [confirmPassword, setConfirmPassword] = (0, react_1.useState)("");
    const [updatePassword, { isSuccess, error }] = (0, userApi_1.useUpdatePasswordMutation)();
    const passwordChangeHandler = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            react_hot_toast_1.toast.error("Passwords do not match");
        }
        else {
            await updatePassword({ oldPassword, newPassword });
        }
    };
    (0, react_1.useEffect)(() => {
        if (isSuccess) {
            react_hot_toast_1.toast.success("Password changed successfully");
        }
        if (error) {
            if ("data" in error) {
                const errorData = error;
                react_hot_toast_1.toast.error(errorData.data.message);
            }
        }
    }, [isSuccess, error]);
    return (<div className="w-full pl-7 px-2 800px:px-5 800px:pl-0">
      <h1 className="block text-[25px] 800px:text-[30px] font-Poppins text-center font-[500] text-black dark:text-[#fff] pb-2">
        Change Password
      </h1>
      <div className="w-full">
        <form aria-required onSubmit={passwordChangeHandler} className="flex flex-col items-center">
          <div className=" w-[100%] 800px:w-[60%] mt-5">
            <label className="block pb-2 text-black dark:text-[#fff]">
              Enter your old password
            </label>
            <input type="password" className={`${style_1.styles.input} !w-[95%] mb-4 800px:mb-0 text-black dark:text-[#fff]`} required value={oldPassword} onChange={(e) => setOldPassword(e.target.value)}/>
          </div>
          <div className=" w-[100%] 800px:w-[60%] mt-2">
            <label className="block pb-2 text-black dark:text-[#fff]">
              Enter your new password
            </label>
            <input type="password" className={`${style_1.styles.input} !w-[95%] mb-4 800px:mb-0 text-black dark:text-[#fff]`} required value={newPassword} onChange={(e) => setNewPassword(e.target.value)}/>
          </div>
          <div className=" w-[100%] 800px:w-[60%] mt-2">
            <label className="block pb-2 text-black dark:text-[#fff]">
              Enter your confirm password
            </label>
            <input type="password" className={`${style_1.styles.input} !w-[95%] mb-4 800px:mb-0 text-black dark:text-[#fff]`} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
            <input className={`w-[95%] h-[40px] border border-[#37a39a] text-center text-black dark:text-[#fff] rounded-[3px] mt-8 cursor-pointer`} required value="Update" type="submit"/>
          </div>
        </form>
      </div>
    </div>);
};
exports.default = ChangePassword;
