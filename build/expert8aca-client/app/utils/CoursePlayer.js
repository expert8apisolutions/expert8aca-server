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
const CoursePlayer = ({ videoUrl }) => {
    const [videoData, setVideoData] = (0, react_1.useState)({
        otp: "",
        playbackInfo: "",
    });
    const [isYoutubeVideo, setIsYoutubeVideo] = (0, react_1.useState)(false);
    const [isStreamableVideo, setStreamableVideo] = (0, react_1.useState)(false);
    const [linkYT, setLinkYT] = (0, react_1.useState)("");
    (0, react_1.useEffect)(() => {
        if (videoUrl?.includes("youtube.com")) {
            setIsYoutubeVideo(true);
            setLinkYT(videoUrl?.replace("watch?v=", "embed/"));
        }
        else if (videoUrl?.includes("streamable.com")) {
            setStreamableVideo(true);
            setLinkYT(videoUrl?.replace(".com/", ".com/e/"));
        }
        else if (videoUrl?.includes("vimeo.com")) {
            setStreamableVideo(true);
            setLinkYT(videoUrl);
        }
        else if (videoUrl?.includes("?h=")) {
            setStreamableVideo(true);
            setLinkYT('https://player.vimeo.com/video/' + videoUrl);
        }
        else {
            setStreamableVideo(true);
            setLinkYT(`https://streamable.com/e/${videoUrl}`);
        }
    }, [videoUrl]);
    const isVideoOrStreamable = isYoutubeVideo || isStreamableVideo;
    return (<div style={{
            position: "relative",
            paddingTop: `${isVideoOrStreamable ? 0 : "5.25%"}`,
            overflow: "hidden",
        }}>
      <>
        {isYoutubeVideo ? (<RenderYoutubeVideo linkYT={linkYT}/>) : (<>
            {isStreamableVideo ? (<RenderStreamableVideo linkYT={linkYT}/>) : (<>
              </>)}
          </>)}
      </>
    </div>);
};
const RenderYoutubeVideo = ({ linkYT }) => {
    return (<div className="videoWrapper">
      <iframe width={560} height={315} src={linkYT} frameBorder={0} allow="autoplay; encrypted-media" allowFullScreen/>
    </div>);
};
const RenderStreamableVideo = ({ linkYT }) => {
    return (<div className="videoWrapper">
      <div style={{
            width: "100%",
            height: 0,
            position: "relative",
            paddingBottom: "62.500%",
        }}>
        <iframe src={linkYT} frameBorder={0} width="100%" height="100%" allowFullScreen style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            left: 0,
            top: 0,
            overflow: "hidden",
        }}/>
      </div>
    </div>);
};
exports.default = CoursePlayer;
