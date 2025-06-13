"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const ai_1 = require("react-icons/ai");
const bs_1 = require("react-icons/bs");
const Ratings = ({ rating }) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars.push(<ai_1.AiFillStar key={i} size={20} color="#f6b100" className="md:mr-2 cursor-pointer"/>);
        }
        else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
            stars.push(<bs_1.BsStarHalf key={i} size={17} color="#fd7e14" className="md:mr-2 cursor-pointer"/>);
        }
        else {
            stars.push(<ai_1.AiOutlineStar key={i} size={20} color="#fd7e14" className="md:mr-2 cursor-pointer"/>);
        }
    }
    return <div className="flex mt-1 md:ml-2 800px:mt-0 800px:ml-0 mb-2"> {stars}</div>;
};
exports.default = Ratings;
