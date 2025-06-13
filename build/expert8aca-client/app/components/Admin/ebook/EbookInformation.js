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
const layoutApi_1 = require("@/redux/features/layout/layoutApi");
const react_1 = __importStar(require("react"));
const CourseInformation = ({ courseInfo, setCourseInfo, active, setActive, }) => {
    const [dragging, setDragging] = (0, react_1.useState)(false);
    const { data } = (0, layoutApi_1.useGetHeroDataQuery)("Categories", {});
    const [categories, setCategories] = (0, react_1.useState)([]);
    (0, react_1.useEffect)(() => {
        if (data) {
            setCategories(data.layout.categories);
        }
    }, [data]);
    const handleSubmit = (e) => {
        e.preventDefault();
        setActive(active + 1);
    };
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (reader.readyState === 2) {
                    setCourseInfo({ ...courseInfo, thumbnail: reader.result });
                }
            };
            reader.readAsDataURL(file);
        }
    };
    const handleDragOver = (e) => {
        e.preventDefault();
        setDragging(true);
    };
    const handleDragLeave = (e) => {
        e.preventDefault();
        setDragging(false);
    };
    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setCourseInfo({ ...courseInfo, thumbnail: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };
    return (<div className="w-[80%] m-auto mt-24">
      <form onSubmit={handleSubmit} className={`${style_1.styles.label}`}>
        <div>
          <label htmlFor="">Course Name</label>
          <input type="name" name="" required value={courseInfo.name} onChange={(e) => setCourseInfo({ ...courseInfo, name: e.target.value })} id="name" placeholder="MERN stack LMS platform with next 13" className={`
            ${style_1.styles.input}`}/>
        </div>
        <br />
        <div className="mb-5">
          <label className={`${style_1.styles.label}`}>Course Description</label>
          <textarea name="" id="" cols={30} rows={8} placeholder="Write something amazing..." className={`${style_1.styles.input} !h-min !py-2`} value={courseInfo.description} onChange={(e) => setCourseInfo({ ...courseInfo, description: e.target.value })}></textarea>
        </div>
        <br />
        <div className="w-full flex justify-between">
          <div className="w-[45%]">
            <label className={`${style_1.styles.label}`}>Course Price</label>
            <input type="number" name="" required value={courseInfo.price} onChange={(e) => setCourseInfo({ ...courseInfo, price: e.target.value })} id="price" placeholder="29" className={`
            ${style_1.styles.input}`}/>
          </div>
          <div className="w-[50%]">
            <label className={`${style_1.styles.label} w-[50%]`}>
              Estimated Price (optional)
            </label>
            <input type="number" name="" value={courseInfo.estimatedPrice} onChange={(e) => setCourseInfo({ ...courseInfo, estimatedPrice: e.target.value })} id="price" placeholder="79" className={`
            ${style_1.styles.input}`}/>
          </div>
        </div>
        <br />
        <div className="w-full flex justify-between">
          <div className="w-[45%]">
            <label className={`${style_1.styles.label}`} htmlFor="email">
              Course Tags
            </label>
            <input type="text" required name="" value={courseInfo.tags} onChange={(e) => setCourseInfo({ ...courseInfo, tags: e.target.value })} id="tags" placeholder="MERN,Next 13,Socket io,tailwind css,LMS" className={`
            ${style_1.styles.input}`}/>
          </div>
          <div className="w-[50%]">
            <label className={`${style_1.styles.label} w-[50%]`}>
              Course Categories
            </label>
            <select name="" id="" className={`${style_1.styles.input}`} value={courseInfo.category} onChange={(e) => setCourseInfo({ ...courseInfo, categories: e.target.value })}>
              <option value="">Select Category</option>
              {categories &&
            categories.map((item) => (<option value={item.title} key={item._id}>
                    {item.title}
                  </option>))}
            </select>
          </div>
        </div>
        <br />
        <div className="w-full flex justify-between">
          <div className="w-[45%]">
            <label className={`${style_1.styles.label}`}>Course Level</label>
            <input type="text" name="" value={courseInfo.level} required onChange={(e) => setCourseInfo({ ...courseInfo, level: e.target.value })} id="level" placeholder="Beginner/Intermediate/Expert" className={`
            ${style_1.styles.input}`}/>
          </div>
          <div className="w-[50%]">
            <label className={`${style_1.styles.label} w-[50%]`}>Demo Url</label>
            <input type="text" name="" required value={courseInfo.demoUrl} onChange={(e) => setCourseInfo({ ...courseInfo, demoUrl: e.target.value })} id="demoUrl" placeholder="eer74fd" className={`
            ${style_1.styles.input}`}/>
          </div>
        </div>
        <br />
        <div className="w-full">
          <input type="file" accept="image/*" id="file" className="hidden" onChange={handleFileChange}/>
          <label htmlFor="file" className={`w-full min-h-[10vh] dark:border-white border-[#00000026] p-3 border flex items-center justify-center ${dragging ? "bg-blue-500" : "bg-transparent"}`} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
            {courseInfo.thumbnail ? (<img src={courseInfo.thumbnail} alt="" className="max-h-full w-full object-cover"/>) : (<span className="text-black dark:text-white">
                Drag and drop your thumbnail here or click to browse
              </span>)}
          </label>
        </div>
        <br />
        <div className="w-full flex items-center justify-end">
          <input type="submit" value="Next" className="w-full 800px:w-[180px] h-[40px] bg-[#37a39a] text-center text-[#fff] rounded mt-8 cursor-pointer"/>
        </div>
        <br />
        <br />
      </form>
    </div>);
};
exports.default = CourseInformation;
