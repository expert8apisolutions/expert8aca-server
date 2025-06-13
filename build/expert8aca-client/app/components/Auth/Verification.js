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
const authApi_1 = require("@/redux/features/auth/authApi");
const react_1 = __importStar(require("react"));
const react_hot_toast_1 = require("react-hot-toast");
const vsc_1 = require("react-icons/vsc");
const react_redux_1 = require("react-redux");
const Verification = ({ setRoute }) => {
    const { token } = (0, react_redux_1.useSelector)((state) => state.auth);
    const [activation, { isSuccess, error }] = (0, authApi_1.useActivationMutation)();
    const [invalidError, setInvalidError] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        if (isSuccess) {
            react_hot_toast_1.toast.success("Account activated successfully");
            setRoute("Login");
        }
        if (error) {
            if ("data" in error) {
                const errorData = error;
                react_hot_toast_1.toast.error(errorData.data.message);
                setInvalidError(true);
            }
            else {
                console.log("An error occured:", error);
            }
        }
    }, [isSuccess, error]);
    const inputRefs = [
        (0, react_1.useRef)(null),
        (0, react_1.useRef)(null),
        (0, react_1.useRef)(null),
        (0, react_1.useRef)(null),
    ];
    const [verifyNumber, setVerifyNumber] = (0, react_1.useState)({
        0: "",
        1: "",
        2: "",
        3: "",
    });
    const verificationHandler = async () => {
        const verificationNumber = Object.values(verifyNumber).join("");
        if (verificationNumber.length !== 4) {
            setInvalidError(true);
            return;
        }
        await activation({
            activation_token: token,
            activation_code: verificationNumber,
        });
    };
    const handleInputChange = (index, value) => {
        setInvalidError(false);
        const newVerifyNumber = { ...verifyNumber, [index]: value };
        setVerifyNumber(newVerifyNumber);
        if (value === "" && index > 0) {
            inputRefs[index - 1].current?.focus();
        }
        else if (value.length === 1 && index < 3) {
            inputRefs[index + 1].current?.focus();
        }
    };
    return (<div>
      <h1 className={`${style_1.styles.title}`}>Verify Your Account</h1>
      <br />
      <div className="w-full flex items-center justify-center mt-2">
        <div className="w-[80px] h-[80px] rounded-full bg-[#497DF2] flex items-center justify-center">
          <vsc_1.VscWorkspaceTrusted size={40}/>
        </div>
      </div>
      <br />
      <br />
      <div className="m-auto flex items-center justify-around">
        {Object.keys(verifyNumber).map((key, index) => (<input type="number" key={key} ref={inputRefs[index]} className={`w-[65px] h-[65px] bg-transparent border-[3px] rounded-[10px] flex items-center text-black dark:text-white justify-center text-[18px] font-Poppins outline-none text-center ${invalidError
                ? "shake border-red-500"
                : "dark:border-white border-[#0000004a]"}`} placeholder="" maxLength={1} value={verifyNumber[key]} onChange={(e) => handleInputChange(index, e.target.value)}/>))}
      </div>
      <br />
      <br />
      <div className="w-full flex justify-center">
        <button className={`${style_1.styles.button}`} onClick={verificationHandler}>
          Verify OTP
        </button>
      </div>
      <br />
      <h5 className="text-center pt-4 font-Poppins text-[14px] text-black dark:text-white">
        Go back to sign in?{" "}
        <span className="text-[#2190ff] pl-1 cursor-pointer" onClick={() => setRoute("Login")}>
          Sign in
        </span>
      </h5>
    </div>);
};
exports.default = Verification;
