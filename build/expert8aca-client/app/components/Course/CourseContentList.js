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
const react_1 = __importStar(require("react"));
const bs_1 = require("react-icons/bs");
const md_1 = require("react-icons/md");
const fa_1 = require("react-icons/fa");
const CourseContentList = (props) => {
    const [visibleSections, setVisibleSections] = (0, react_1.useState)(new Set());
    // Find unique video sections
    const videoSections = [
        ...new Set(props.data?.map((item) => item.videoSection)),
    ];
    let totalCount = 0; // Total count of videos from previous sections
    const toggleSection = (section) => {
        const newVisibleSections = new Set(visibleSections);
        if (newVisibleSections.has(section)) {
            newVisibleSections.delete(section);
        }
        else {
            newVisibleSections.add(section);
        }
        setVisibleSections(newVisibleSections);
    };
    (0, react_1.useEffect)(() => {
        if (props.data) {
            const sectionName = getLastSectionFromVideoCompleted();
            toggleSection(sectionName);
        }
    }, [props.data]);
    const getLastSectionFromVideoCompleted = () => {
        if (!props.userProgress)
            return "";
        const lastVideo = props.userProgress?.video_compleated_id?.[props.userProgress?.video_compleated_id?.length - 1];
        const video = props.data.find((item) => item._id === lastVideo?.video_id);
        const prevSection = video?.videoSection;
        return prevSection;
    };
    const getIsCompleted = (videoId) => {
        if (!props.userProgress)
            return false;
        return props.userProgress?.video_compleated_id?.find?.(item => item.video_id === videoId);
    };
    return (<div className={`mt-[15px] w-full`}>
      {videoSections.map((section, sectionIndex) => {
            const isSectionVisible = visibleSections.has(section);
            // Filter videos by section
            const sectionVideos = props.data.filter((item) => item.videoSection === section);
            const sectionVideoCount = sectionVideos.length; // Number of videos in the current section
            const sectionVideoLength = sectionVideos.reduce((totalLength, item) => totalLength + item.videoLength, 0);
            const sectionStartIndex = totalCount; // Start index of videos within the current section
            totalCount += sectionVideoCount; // Update the total count of videos
            const sectionContentHours = sectionVideoLength / 60;
            return (<div className={`${!props.isDemo && 'border-b border-[#0000001c] dark:border-[#ffffff8e] pb-2 text-black'}`} key={section}>
            <div className="w-full flex">
              {/* Render video section */}
              <div className="w-full flex justify-between items-center">
                <h2 className="text-[18px] text-black">{section}</h2>
                <button className="mr-4 cursor-pointer text-black" onClick={() => toggleSection(section)}>
                  {isSectionVisible ? (<bs_1.BsChevronUp size={20}/>) : (<bs_1.BsChevronDown size={20}/>)}
                </button>
              </div>
            </div>
            <h5 className="text-black">
              {sectionVideoCount} Lessons ·{" "}
              {sectionVideoLength < 60
                    ? sectionVideoLength
                    : sectionContentHours.toFixed(2)}{" "}
              {sectionVideoLength > 60 ? "hours" : "minutes"}
            </h5>
            <br />
            {isSectionVisible && (<div className="w-full">
                {sectionVideos.map((item, index) => {
                        const videoIndex = sectionStartIndex + index; // Calculate the video index within the overall list
                        const contentLength = item.videoLength / 60;
                        const isVideoCompleted = getIsCompleted(item._id);
                        return (<div className={`w-full ${videoIndex === props.activeVideo ? "bg-slate-200 text-white" : ""} cursor-pointer transition-all p-2`} key={item._id} onClick={() => props.isDemo ? null : props?.setActiveVideo(videoIndex)}>
                      <div className="flex items-start">
                        <div className="flex items-center">
                          {isVideoCompleted ? <fa_1.FaCheckCircle size={15} className="mr-2 text-[#00c75a]"/>
                                :
                                    <md_1.MdOutlineOndemandVideo size={25} className="mr-2" color="#1cdada"/>}
                          <h1 className={`text-[16px] inline-block break-words  ${isVideoCompleted ? 'text-gray-500' : 'text-black'}`}>
                            {item.title}
                          </h1>
                        </div>
                      </div>
                      <h5 className={`pl-8  ${isVideoCompleted ? 'text-gray-500' : 'text-black'}`}>
                        {item.videoLength > 60 ? contentLength.toFixed(2) : item.videoLength}{" "}
                        {item.videoLength > 60 ? "hours" : "minutes"}
                      </h5>
                    </div>);
                    })}
              </div>)}
          </div>);
        })}
    </div>);
};
exports.default = CourseContentList;
