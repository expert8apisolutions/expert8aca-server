"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Ratings_1 = __importDefault(require("@/app/utils/Ratings"));
const react_1 = __importDefault(require("react"));
const ReviewCard = (props) => {
    return (<div className="w-full h-max pb-4  dark:bg-slate-500 dark:bg-opacity-[0.20] border border-[#00000028] dark:border-[#ffffff1d] backdrop-blur shadow-[bg-slate-700] rounded-lg p-3 shadow-inner">
      <div className="flex w-full">
       
        <div className="800px:flex justify-between w-full hidden">
          <div className="pl-4">
            <h5 className="text-[20px] text-black dark:text-white">
              {props.item.name}
            </h5>
            <h6 className="text-[16px] text-[#000] dark:text-[#ffffffab]">
              {props.item.profession}
            </h6>
          </div>
          <Ratings_1.default rating={5}/>
        </div>
         {/* for mobile */}
         <div className="800px:hidden justify-between w-full flex flex-col">
          <div className="pl-4">
            <h5 className="text-[20px] text-black dark:text-white">
              {props.item.name}
            </h5>
            <h6 className="text-[16px] text-[#000] dark:text-[#ffffffab]">
              {props.item.profession}
            </h6>
          </div> 
        
          <Ratings_1.default rating={5}/>
        </div>
      </div>
      <p className="pt-2 px-2 font-Poppins
      text-black dark:text-white
      ">
        {props.item.comment}
      </p>
    </div>);
};
exports.default = ReviewCard;
