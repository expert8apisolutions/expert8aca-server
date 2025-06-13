"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const style_1 = require("@/app/styles/style");
const react_1 = __importDefault(require("react"));
const ai_1 = require("react-icons/ai");
const react_hot_toast_1 = require("react-hot-toast");
const CourseData = ({ benefits, setBenefits, prerequisites, setPrerequisites, active, setActive, }) => {
    const handleBenefitChange = (index, value) => {
        const updatedBenefits = benefits.map((item, idx) => {
            if (idx === index) {
                return { ...item, title: value };
            }
            return item;
        });
        setBenefits(updatedBenefits);
    };
    const handleAddBenefit = () => {
        setBenefits([...benefits, { title: "" }]);
    };
    const handlePrerequisitesChange = (index, value) => {
        const updatedPrerequisites = prerequisites.map((item, idx) => {
            if (idx === index) {
                return { ...item, title: value };
            }
            return item;
        });
        setPrerequisites(updatedPrerequisites);
    };
    const handleAddPrerequisites = () => {
        setPrerequisites([...prerequisites, { title: "" }]);
    };
    const prevButton = () => {
        setActive(active - 1);
    };
    const handleOptions = () => {
        if (benefits[benefits.length - 1]?.title !== "" &&
            prerequisites[prerequisites.length - 1]?.title !== "") {
            setActive(active + 1);
        }
        else {
            react_hot_toast_1.toast.error("Please fill the fields for go to next!");
        }
    };
    return (<div className="w-[80%] m-auto mt-24 block">
      <div>
        <label className={`${style_1.styles.label} text-[20px]`} htmlFor="email">
          What are the benefits for students in this course?
        </label>
        <br />
        {benefits.map((benefit, index) => (<input type="text" key={index} name="Benefit" placeholder="You will be able to build a full stack LMS Platform..." required className={`${style_1.styles.input} my-2`} value={benefit.title} onChange={(e) => handleBenefitChange(index, e.target.value)}/>))}
        <ai_1.AiOutlinePlusCircle style={{ margin: "10px 0px", cursor: "pointer", width: "30px" }} onClick={handleAddBenefit}/>
      </div>

      <div>
        <label className={`${style_1.styles.label} text-[20px]`} htmlFor="email">
          What are the prerequisites for starting this course?
        </label>
        <br />
        {prerequisites.map((prerequisites, index) => (<input type="text" key={index} name="prerequisites" placeholder="You need basic knowledge of MERN stack" required className={`${style_1.styles.input} my-2`} value={prerequisites.title} onChange={(e) => handlePrerequisitesChange(index, e.target.value)}/>))}
        <ai_1.AiOutlinePlusCircle style={{ margin: "10px 0px", cursor: "pointer", width: "30px" }} onClick={handleAddPrerequisites}/>
      </div>
      <div className="w-full flex items-center justify-between">
        <div className="w-full 800px:w-[180px] flex items-center justify-center h-[40px] bg-[#37a39a] text-center text-[#fff] rounded mt-8 cursor-pointer" onClick={() => prevButton()}>
          Prev
        </div>
        <div className="w-full 800px:w-[180px] flex items-center justify-center h-[40px] bg-[#37a39a] text-center text-[#fff] rounded mt-8 cursor-pointer" onClick={() => handleOptions()}>
          Next
        </div>
      </div>
    </div>);
};
exports.default = CourseData;
