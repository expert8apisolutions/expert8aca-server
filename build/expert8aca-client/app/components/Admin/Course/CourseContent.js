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
const react_1 = __importStar(require("react"));
const react_hot_toast_1 = require("react-hot-toast");
const ai_1 = require("react-icons/ai");
const bs_1 = require("react-icons/bs");
const md_1 = require("react-icons/md");
const CourseContent = ({ courseContentData, setCourseContentData, active, setActive, handleSubmit: handlleCourseSubmit, }) => {
    const [isCollapsed, setIsCollapsed] = (0, react_1.useState)(Array(courseContentData.length).fill(false));
    const [activeSection, setActiveSection] = (0, react_1.useState)(1);
    const handleSubmit = (e) => {
        e.preventDefault();
    };
    const handleCollapseToggle = (index) => {
        const updatedCollasped = [...isCollapsed];
        updatedCollasped[index] = !updatedCollasped[index];
        setIsCollapsed(updatedCollasped);
    };
    const handleRemoveLink = (index, linkIndex) => {
        const updatedData = [...courseContentData];
        updatedData[index].links.splice(linkIndex, 1);
        setCourseContentData(updatedData);
    };
    const handleAddLink = (index) => {
        const updatedData = [...courseContentData];
        updatedData[index].links.push({ title: "", url: "" });
        setCourseContentData(updatedData);
    };
    const newContentHandler = (item) => {
        if (item.title === "" ||
            item.description === "" ||
            item.videoUrl === "" ||
            item.links[0].title === "" ||
            item.links[0].url === "" ||
            item.videoLength === "") {
            react_hot_toast_1.toast.error("Please fill all the fields first!");
        }
        else {
            let newVideoSection = "";
            if (courseContentData.length > 0) {
                const lastVideoSection = courseContentData[courseContentData.length - 1].videoSection;
                // use the last videoSection if available, else use user input
                if (lastVideoSection) {
                    newVideoSection = lastVideoSection;
                }
            }
            let newContent = {
                videoUrl: "",
                title: "",
                description: "",
                videoSection: newVideoSection,
                videoLength: "",
                links: [{ title: "", url: "" }],
            };
            setCourseContentData([...courseContentData, newContent]);
        }
    };
    const addNewSection = () => {
        if (courseContentData[courseContentData.length - 1].title === "" ||
            courseContentData[courseContentData.length - 1].description === "" ||
            courseContentData[courseContentData.length - 1].videoUrl === "" ||
            courseContentData[courseContentData.length - 1].links[0].title === "" ||
            courseContentData[courseContentData.length - 1].links[0].url === "") {
            react_hot_toast_1.toast.error("Please fill all the fields first!");
        }
        else {
            setActiveSection(activeSection + 1);
            const newContent = {
                videoUrl: "",
                title: "",
                description: "",
                videoLength: "",
                videoSection: `Untitled Section ${activeSection}`,
                links: [{ title: "", url: "" }],
            };
            setCourseContentData([...courseContentData, newContent]);
        }
    };
    const prevButton = () => {
        setActive(active - 1);
    };
    const handleOptions = () => {
        if (courseContentData[courseContentData.length - 1].title === "" ||
            courseContentData[courseContentData.length - 1].description === "" ||
            courseContentData[courseContentData.length - 1].videoUrl === "" ||
            courseContentData[courseContentData.length - 1].videoLength === "" ||
            courseContentData[courseContentData.length - 1].links[0].title === "" ||
            courseContentData[courseContentData.length - 1].links[0].url === "") {
            react_hot_toast_1.toast.error("section can't be empty!");
        }
        else {
            setActive(active + 1);
            handlleCourseSubmit();
        }
    };
    return (<div className="w-[80%] m-auto mt-24 p-3">
      <form onSubmit={handleSubmit}>
        {courseContentData?.map((item, index) => {
            const showSectionInput = index === 0 ||
                item.videoSection !== courseContentData[index - 1].videoSection;
            return (<div className={`w-full bg-[#cdc8c817] p-4 ${showSectionInput ? "mt-10" : "mb-0"}`} key={index}>
              {showSectionInput && (<>
                  <div className="flex w-full items-center">
                    <input type="text" className={`text-[20px] ${item.videoSection === "Untitled Section"
                        ? "w-[170px]"
                        : "w-min"} font-Poppins cursor-pointer dark:text-white text-black bg-transparent outline-none`} value={item.videoSection} onChange={(e) => {
                        const updatedData = [...courseContentData];
                        updatedData[index] = {
                            ...updatedData[index],
                            videoSection: e.target.value,
                        };
                        setCourseContentData(updatedData);
                    }}/>
                    <bs_1.BsPencil className="cursor-pointer dark:text-white text-black"/>
                  </div>
                  <br />
                </>)}

              <div className="flex w-full items-center justify-between my-0">
                {isCollapsed[index] ? (<>
                    {item.title ? (<p className="font-Poppins dark:text-white text-black">
                        {index + 1}. {item.title}
                      </p>) : (<></>)}
                  </>) : (<div></div>)}

                {/* // arrow button for collasped video content */}
                <div className="flex items-center">
                  <ai_1.AiOutlineDelete className={`dark:text-white text-[20px] mr-2 text-black ${index > 0 ? "cursor-pointer" : "cursor-no-drop"}`} onClick={() => {
                    if (index > 0) {
                        const updatedData = [...courseContentData];
                        updatedData.splice(index, 1);
                        setCourseContentData(updatedData);
                    }
                }}/>
                  <md_1.MdOutlineKeyboardArrowDown fontSize="large" className="dark:text-white text-black" style={{
                    transform: isCollapsed[index]
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                }} onClick={() => handleCollapseToggle(index)}/>
                </div>
              </div>
              {!isCollapsed[index] && (<>
                  <div className="my-3">
                    <label className={style_1.styles.label}>Video Title</label>
                    <input type="text" placeholder="Project Plan..." className={`${style_1.styles.input}`} value={item.title} onChange={(e) => {
                        const updatedData = [...courseContentData];
                        updatedData[index] = {
                            ...updatedData[index],
                            title: e.target.value,
                        };
                        setCourseContentData(updatedData);
                    }}/>
                  </div>
                  <div className="mb-3">
                    <label className={style_1.styles.label}>Video Url</label>
                    <input type="text" placeholder="sdder" className={`${style_1.styles.input}`} value={item.videoUrl} onChange={(e) => {
                        const updatedData = [...courseContentData];
                        updatedData[index] = {
                            ...updatedData[index],
                            videoUrl: e.target.value,
                        };
                        setCourseContentData(updatedData);
                    }}/>
                  </div>
                  <div className="mb-3">
                    <label className={style_1.styles.label}>
                      Video Length (in minutes)
                    </label>
                    <input type="number" placeholder="20" className={`${style_1.styles.input}`} value={item.videoLength} onChange={(e) => {
                        const updatedData = [...courseContentData];
                        updatedData[index] = {
                            ...updatedData[index],
                            videoLength: e.target.value,
                        };
                        setCourseContentData(updatedData);
                    }}/>
                  </div>

                  <div className="mb-3">
                    <label className={style_1.styles.label}>Video Description</label>
                    <textarea rows={8} cols={30} placeholder="sdder" className={`${style_1.styles.input} !h-min py-2`} value={item.description} onChange={(e) => {
                        const updatedData = [...courseContentData];
                        updatedData[index] = {
                            ...updatedData[index],
                            description: e.target.value,
                        };
                        setCourseContentData(updatedData);
                    }}/>
                    <br />
                  </div>
                  {item?.links.map((link, linkIndex) => (<div className="mb-3 block" key={linkIndex}>
                      <div className="w-full flex items-center justify-between">
                        <label className={style_1.styles.label}>
                          Link {linkIndex + 1}
                        </label>
                        <ai_1.AiOutlineDelete className={`${linkIndex === 0
                            ? "cursor-no-drop"
                            : "cursor-pointer"} text-black dark:text-white text-[20px]`} onClick={() => linkIndex === 0
                            ? null
                            : handleRemoveLink(index, linkIndex)}/>
                      </div>
                      <input type="text" placeholder="Source Code... (Link title)" className={`${style_1.styles.input}`} value={link.title} onChange={(e) => {
                            const updatedData = courseContentData.map((item, dataIndex) => {
                                if (dataIndex === index) {
                                    const updatedLinks = item.links.map((linkItem, linkItemIndex) => {
                                        if (linkItemIndex === linkIndex) {
                                            return {
                                                ...linkItem,
                                                title: e.target.value,
                                            };
                                        }
                                        return linkItem;
                                    });
                                    return { ...item, links: updatedLinks };
                                }
                                return item;
                            });
                            setCourseContentData(updatedData);
                        }}/>
                      <input type="url" placeholder="Source Code Url... (Link URL)" className={`${style_1.styles.input} mt-6`} value={link.url} onChange={(e) => {
                            const updatedData = courseContentData.map((item, dataIndex) => {
                                if (dataIndex === index) {
                                    const updatedLinks = item.links.map((linkItem, linkItemIndex) => {
                                        if (linkItemIndex === linkIndex) {
                                            return {
                                                ...linkItem,
                                                url: e.target.value,
                                            };
                                        }
                                        return linkItem;
                                    });
                                    return { ...item, links: updatedLinks };
                                }
                                return item;
                            });
                            setCourseContentData(updatedData);
                        }}/>
                    </div>))}
                  <br />
                  {/* add link button */}
                  <div className="inline-block mb-4">
                    <p className="flex items-center text-[18px] dark:text-white text-black cursor-pointer" onClick={() => handleAddLink(index)}>
                      <bs_1.BsLink45Deg className="mr-2"/> Add Link
                    </p>
                  </div>
                </>)}
              <br />
              {/* add new content */}
              {index === courseContentData.length - 1 && (<div>
                  <p className="flex items-center text-[18px] dark:text-white text-black cursor-pointer" onClick={(e) => newContentHandler(item)}>
                    <ai_1.AiOutlinePlusCircle className="mr-2"/> Add New Content
                  </p>
                </div>)}
            </div>);
        })}
        <br />
        <div className="flex items-center text-[20px] dark:text-white text-black cursor-pointer" onClick={() => addNewSection()}>
          <ai_1.AiOutlinePlusCircle className="mr-2"/> Add new Section
        </div>
      </form>
      <br />
      <div className="w-full flex items-center justify-between">
        <div className="w-full 800px:w-[180px] flex items-center justify-center h-[40px] bg-[#37a39a] text-center text-[#fff] rounded mt-8 cursor-pointer" onClick={() => prevButton()}>
          Prev
        </div>
        <div className="w-full 800px:w-[180px] flex items-center justify-center h-[40px] bg-[#37a39a] text-center text-[#fff] rounded mt-8 cursor-pointer" onClick={() => handleOptions()}>
          Next
        </div>
      </div>
      <br />
      <br />
      <br />
    </div>);
};
exports.default = CourseContent;
