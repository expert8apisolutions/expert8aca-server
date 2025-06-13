"use strict";
"use client";
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
const react_1 = __importStar(require("react"));
const formik_1 = require("formik");
const Yup = __importStar(require("yup"));
const ai_1 = require("react-icons/ai");
const fc_1 = require("react-icons/fc");
const style_1 = require("../../../app/styles/style");
const authApi_1 = require("@/redux/features/auth/authApi");
const react_hot_toast_1 = require("react-hot-toast");
const schema = Yup.object().shape({
    name: Yup.string().required("Please enter your name!"),
    email: Yup.string()
        .email("Invalid email!")
        .required("Please enter your email!"),
    password: Yup.string().required("Please enter your password!").min(6),
});
const Signup = ({ setRoute }) => {
    const [show, setShow] = (0, react_1.useState)(false);
    const [register, { data, error, isSuccess }] = (0, authApi_1.useRegisterMutation)();
    (0, react_1.useEffect)(() => {
        if (isSuccess) {
            const message = data?.message || "Registration successful";
            react_hot_toast_1.toast.success(message);
            setRoute("Verification");
        }
        if (error) {
            if ("data" in error) {
                const errorData = error;
                react_hot_toast_1.toast.error(errorData.data.message);
            }
        }
    }, [isSuccess, error]);
    const formik = (0, formik_1.useFormik)({
        initialValues: { name: "", email: "", password: "" },
        validationSchema: schema,
        onSubmit: async ({ name, email, password }) => {
            const data = {
                name, email, password
            };
            await register(data);
        },
    });
    const { errors, touched, values, handleChange, handleSubmit } = formik;
    return (<div className="w-full">
      <h1 className={`${style_1.styles.title}`}>Join to ELearning</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className={`${style_1.styles.label}`} htmlFor="email">
            Enter your Name
          </label>
          <input type="text" name="" value={values.name} onChange={handleChange} id="name" placeholder="johndoe" className={`${errors.name && touched.name && "border-red-500"} ${style_1.styles.input}`}/>
          {errors.name && touched.name && (<span className="text-red-500 pt-2 block">{errors.name}</span>)}
        </div>
        <label className={`${style_1.styles.label}`} htmlFor="email">
          Enter your Email
        </label>
        <input type="email" name="" value={values.email} onChange={handleChange} id="email" placeholder="loginmail@gmail.com" className={`${errors.email && touched.email && "border-red-500"} ${style_1.styles.input}`}/>
        {errors.email && touched.email && (<span className="text-red-500 pt-2 block">{errors.email}</span>)}
        <div className="w-full mt-5 relative mb-1">
          <label className={`${style_1.styles.label}`} htmlFor="email">
            Enter your password
          </label>
          <input type={!show ? "password" : "text"} name="password" value={values.password} onChange={handleChange} id="password" placeholder="password!@%" className={`${errors.password && touched.password && "border-red-500"} ${style_1.styles.input}`}/>
          {!show ? (<ai_1.AiOutlineEyeInvisible className="absolute bottom-3 right-2 z-1 cursor-pointer" size={20} onClick={() => setShow(true)}/>) : (<ai_1.AiOutlineEye className="absolute bottom-3 right-2 z-1 cursor-pointer" size={20} onClick={() => setShow(false)}/>)}
        </div>
        {errors.password && touched.password && (<span className="text-red-500 pt-2 block">{errors.password}</span>)}
        <div className="w-full mt-5">
          <input type="submit" value="Sign Up" className={`${style_1.styles.button}`}/>
        </div>
        <br />
        <h5 className="text-center pt-4 font-Poppins text-[14px] text-black dark:text-white">
          Or join with
        </h5>
        <div className="flex items-center justify-center my-3">
          <fc_1.FcGoogle size={30} className="cursor-pointer mr-2"/>
          <ai_1.AiFillGithub size={30} className="cursor-pointer ml-2"/>
        </div>
        <h5 className="text-center pt-4 font-Poppins text-[14px]">
          Already have an account?{" "}
          <span className="text-[#2190ff] pl-1 cursor-pointer" onClick={() => setRoute("Login")}>
            Sign in
          </span>
        </h5>
      </form>
      <br />
    </div>);
};
exports.default = Signup;
