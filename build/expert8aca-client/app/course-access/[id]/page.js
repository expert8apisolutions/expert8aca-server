"use strict";
'use client';
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
const CourseContent_1 = __importDefault(require("@/app/components/Course/CourseContent"));
const Loader_1 = __importDefault(require("@/app/components/Loader/Loader"));
const Header_1 = __importDefault(require("@/app/components/Header"));
const dayjs_1 = __importDefault(require("dayjs"));
const apiSlice_1 = require("@/redux/features/api/apiSlice");
const axios_1 = __importDefault(require("axios"));
const navigation_1 = require("next/navigation");
const react_1 = __importStar(require("react"));
const Page = ({ params }) => {
    const id = params.id;
    const { isLoading, error, data, refetch } = (0, apiSlice_1.useLoadUserQuery)(undefined, {});
    const router = (0, navigation_1.useRouter)();
    const [open, setOpen] = (0, react_1.useState)(false);
    const [route, setRoute] = (0, react_1.useState)('Login');
    const searchParams = (0, navigation_1.useSearchParams)();
    const paymentToken = searchParams?.get("ptoken");
    (0, react_1.useEffect)(() => {
        if (paymentToken) {
            checkPaymentToken();
        }
    }, []);
    const checkPaymentToken = async () => {
        try {
            const result = await axios_1.default.get(`${process.env.NEXT_PUBLIC_SERVER_URI}/create-order-postback?payment_token=${paymentToken}`);
        }
        catch (err) {
        }
        window.location.href = `/course-access/${id}`;
    };
    (0, react_1.useEffect)(() => {
        if (!paymentToken) {
            if (data) {
                const isPurchased = data.user.courses.find((item) => item.courseId === id);
                if (!isPurchased) {
                    router.replace("/");
                }
            }
        }
    }, [data, error]);
    const foundUserCourse = data?.user?.courses?.find(ele => ele.courseId === id);
    let diffDays = 0;
    if (foundUserCourse) {
        const expireDate = new Date((0, dayjs_1.default)(foundUserCourse.expireDate).format('MM/DD/YYYY')).getTime();
        const currentDate = new Date((0, dayjs_1.default)().format('MM/DD/YYYY')).getTime();
        const diffTime = expireDate - currentDate;
        diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    return (<>
      {(paymentToken || isLoading) ? (<Loader_1.default />) : (<div>
          {diffDays <= 0 ? <>
              <Header_1.default activeItem={1} open={open} setOpen={setOpen} route={route} setRoute={setRoute}/>
              <div className="w-full text-center min-h-full text-back">
                <span className="text-[24px]"> Course Expired</span>
              </div>

            </>
                :
                    <CourseContent_1.default id={id} user={data.user}/>}

        </div>)}
    </>);
};
exports.default = Page;
