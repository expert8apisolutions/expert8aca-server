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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const image_1 = __importDefault(require("next/image"));
const style_1 = require("../../../app/styles/style");
const react_1 = __importStar(require("react"));
const ai_1 = require("react-icons/ai");
const avatar_png_1 = __importDefault(require("../../../public/assests/avatar.png"));
const userApi_1 = require("@/redux/features/user/userApi");
const apiSlice_1 = require("@/redux/features/api/apiSlice");
const react_hot_toast_1 = require("react-hot-toast");
const ProfileInfo = ({ avatar, user }) => {
    const [name, setName] = (0, react_1.useState)(user && user.name);
    const [updateAvatar, { isSuccess, error }] = (0, userApi_1.useUpdateAvatarMutation)();
    const [editProfile, { isSuccess: success, error: updateError }] = (0, userApi_1.useEditProfileMutation)();
    const [loadUser, setLoadUser] = (0, react_1.useState)(false);
    const {} = (0, apiSlice_1.useLoadUserQuery)(undefined, { skip: loadUser ? false : true });
    const imageHandler = async (e) => {
        const fileReader = new FileReader();
        fileReader.onload = () => {
            if (fileReader.readyState === 2) {
                const avatar = fileReader.result;
                updateAvatar(avatar);
            }
        };
        fileReader.readAsDataURL(e.target.files[0]);
    };
    (0, react_1.useEffect)(() => {
        if (isSuccess) {
            setLoadUser(true);
        }
        if (error || updateError) {
            console.log(error);
        }
        if (success) {
            react_hot_toast_1.toast.success("Profile updated successfully!");
            setLoadUser(true);
        }
    }, [isSuccess, error, success, updateError]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (name !== "") {
            await editProfile({
                name: name,
            });
        }
    };
    return (<>
      <div className="w-full flex justify-center">
        <div className="relative">
          <image_1.default src={user.avatar || avatar ? user.avatar.url || avatar : avatar_png_1.default} alt="" width={120} height={120} className="w-[120px] h-[120px] cursor-pointer border-[3px] border-[#37a39a] rounded-full"/>
          <input type="file" name="" id="avatar" className="hidden" onChange={imageHandler} accept="image/png,image/jpg,image/jpeg,image/webp"/>
          <label htmlFor="avatar">
            <div className="w-[30px] h-[30px] bg-slate-900 rounded-full absolute bottom-2 right-2 flex items-center justify-center cursor-pointer">
              <ai_1.AiOutlineCamera size={20} className="z-1"/>
            </div>
          </label>
        </div>
      </div>
      <br />
      <br />
      <div className="w-full pl-6 800px:pl-10">
        <form onSubmit={handleSubmit}>
          <div className="800px:w-[50%] m-auto block pb-4">
            <div className="w-[100%]">
              <label className="block pb-2">Full Name</label>
              <input type="text" className={`${style_1.styles.input} !w-[95%] mb-4 800px:mb-0`} required value={name} onChange={(e) => setName(e.target.value)}/>
            </div>
            <div className="w-[100%] pt-2">
              <label className="block pb-2">Email Address</label>
              <input type="text" readOnly className={`${style_1.styles.input} !w-[95%] mb-1 800px:mb-0`} required value={user?.email}/>
            </div>
            <input className={`w-full 800px:w-[250px] h-[40px] border border-[#37a39a] text-center dark:text-[#fff] text-black rounded-[3px] mt-8 cursor-pointer`} required value="Update" type="submit"/>
          </div>
        </form>
        <br />
      </div>
    </>);
};
exports.default = ProfileInfo;
