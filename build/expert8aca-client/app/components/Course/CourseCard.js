"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Ratings_1 = __importDefault(require("@/app/utils/Ratings"));
const dayjs_1 = __importDefault(require("dayjs"));
const image_1 = __importDefault(require("next/image"));
const link_1 = __importDefault(require("next/link"));
const react_1 = __importDefault(require("react"));
const CourseCard = ({ item, isProfile, expireIn = null }) => {
    const isExpire = expireIn !== null && expireIn <= 0;
    let expireDateText = '';
    if (expireIn !== null) {
        expireDateText = (0, dayjs_1.default)((0, dayjs_1.default)().add(+expireIn, 'day').toDate()).format('DD/MM/YYYY');
    }
    return (<link_1.default href={(!isProfile || isExpire) ? `/course/${item._id}` : `course-access/${item._id}`}>
      {/* <div className="w-full h-[120px] md:min-h-[35vh]  box-shadow-grow  dark:bg-slate-500 dark:bg-opacity-20 backdrop-blur  rounded-lg md:p-3 p-1"> */}

      <div className="w-full md:h-[initial] md:min-h-[35vh] bg-white flex flex-col md:block  box-shadow-grow  dark:bg-slate-500 dark:bg-opacity-20 backdrop-blur  rounded-lg md:p-3 p-1">
        <image_1.default src={item.thumbnail.url} width={500} height={300} objectFit="contain" className="rounded md:w-full w-[100%] h-[100%] md:h-full" alt=""/>
        <br />
        {/* for PC */}
        <div className="hidden md:block">
          <div className="min-h-[45px]">
            <h1 className="font-Poppins text-[24px] font-semibold md:text-[16px] text-[#555555] dark:text-[#fff]">
              {item.name}
            </h1>
          </div>
          <div className="min-h-[50px]">
            <p className="font-Poppins text-[18px] md:text-[14px] text-[#777] dark:text-[#fff]">
              {item.description}
            </p>
          </div>
          <div className="w-full flex flex-col md:flex-row items-center justify-between">
            <Ratings_1.default rating={item.ratings}/>
            <h5 className={`text-black dark:text-[#fff] text-[18px] md:text-[12px] ${isProfile && "hidden 800px:inline"}`}>
              {item.purchased} Students
            </h5>
          </div>
          <div className="w-full flex flex-col-reverse md:flex-row  items-center justify-between pt-1 md:pt-3">
            <div className="flex">
              <h3 className="text-[#dc3545] dark:text-[#fff]">
                {item.price === 0 ? "Free" : item.price + "฿"}
              </h3>
              <h5 className="pl-3 text-[14px] mt-[-5px] line-through opacity-80 text-[#777] dark:text-[#fff]">
                {item.estimatedPrice}฿
              </h5>
            </div>
            <div className="flex items-center pb-3">
              <h5 className=" text-black dark:text-[#777] text-[10px] md:text-[12px]">
                {item.courseData?.length} Lectures
              </h5>
            </div>
          </div>
          {expireIn !== null ? <div className="flex items-center pb-3">
            <h5 className="text-[12px] text-black dark:text-[#fff] mt-2">
              {expireIn > 0 ? <span> หมดอายุในอีก {expireIn} วัน <span className="text-gray-500">{expireDateText}</span></span> : <span className="text-[red]"> หมดอายุแล้ว</span>}
            </h5>
          </div>
            : ''}
        </div>
        {/* for Mobile */}
        <div className="block md:hidden p-3 w-full relative">
          <h1 className="font-Poppins text-[18px] font-semibold md:text-[16px] text-[#555555] dark:text-[#fff]">
            {item.name}
          </h1>
          <div className="">
            <p className="font-Poppins text-[12px] md:text-[14px] text-[#777] dark:text-[#fff]">
              {item.description}
            </p>
          </div>
          <div className="w-full flex flex-col md:flex-row text-[#777]">
            <Ratings_1.default rating={item.ratings}/>
            <h5 className={`text-[#777] text-[10px] md:text-[12px] ${isProfile && "hidden 800px:inline"}`}>
              {item.courseData?.length} Lectures | {item.purchased} Students
            </h5>
          </div>
          <h3 className="text-[#dc3545] dark:text-[#fff] absolute right-[50px] bottom-0">
            {item.price === 0 ? "Free" : item.price + "฿"}
          </h3>
          <h5 className="pl-3 text-[10px] mt-[-5px] line-through opacity-80 text-[#777] dark:text-[#fff] absolute right-1 bottom-0">
            {item.estimatedPrice}฿
          </h5>
        </div>
        {/* {
          expireIn !== null ? <div className="flex items-center pb-3">
            <h5 className="text-[12px] text-black dark:text-[#fff] mt-2">
              {
                expireIn > 0 ? <span> หมดอายุในอีก {expireIn} วัน <span className="text-gray-500">{expireDateText}</span></span> : <span className="text-[red]"> หมดอายุแล้ว</span>
              }
            </h5>
          </div>
            : ''
        } */}
      </div>
    </link_1.default>);
};
exports.default = CourseCard;
