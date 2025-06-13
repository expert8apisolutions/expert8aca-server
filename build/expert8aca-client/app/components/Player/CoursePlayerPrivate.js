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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_player_1 = __importDefault(require("react-player"));
const useVideoWatchTime_1 = __importDefault(require("@/app/hooks/useVideoWatchTime"));
const CoursePlayerPrivate = ({ courseId, videoUrl, onCompleteVideo, onUpdateTime }) => {
    const [isYoutubeVideo, setIsYoutubeVideo] = (0, react_1.useState)(false);
    const [isStreamableVideo, setStreamableVideo] = (0, react_1.useState)(false);
    const [linkVideo, setLinkVideo] = (0, react_1.useState)("");
    const [currentTime, setCurrentTime] = (0, react_1.useState)(0);
    const playerRef = (0, react_1.useRef)(null);
    const { watchTime, startCounting, pauseCounting, updateWatchTime, } = (0, useVideoWatchTime_1.default)(courseId);
    (0, react_1.useEffect)(() => {
        if (videoUrl?.includes("youtube.com")) {
            setIsYoutubeVideo(true);
            setLinkVideo(videoUrl?.replace("watch?v=", "embed/"));
        }
        else if (videoUrl?.includes("streamable.com")) {
            setStreamableVideo(true);
            setLinkVideo(videoUrl);
            // setLinkVideo(videoUrl?.replace(".com/", ".com/e/"));
        }
        else if (videoUrl?.includes("vimeo.com")) {
            const replaceWeb = videoUrl.replace("https://vimeo.com/", "");
            const newVideoUrl = `https://player.vimeo.com/video/${replaceWeb.replace("/", "?h=")}`;
            setStreamableVideo(true);
            setLinkVideo(newVideoUrl);
        }
        else if (videoUrl?.includes("?h=")) {
            setStreamableVideo(true);
            setLinkVideo('https://player.vimeo.com/video/' + videoUrl);
        }
        else {
            setStreamableVideo(true);
            setLinkVideo(`https://streamable.com/o/${videoUrl}`);
        }
        pauseCounting();
    }, [videoUrl]);
    (0, react_1.useEffect)(() => {
        onUpdateTime(currentTime);
    }, [currentTime]);
    const handleProgress = (progress) => {
        setCurrentTime(progress.playedSeconds);
    };
    const handleVideoEnded = () => {
        onCompleteVideo();
        pauseCounting();
    };
    const handleSeek = (time) => {
        setCurrentTime(time);
        if (playerRef.current) {
            playerRef.current.seekTo(2469);
        }
    };
    const isVideoOrStreamable = isYoutubeVideo || isStreamableVideo;
    return (<div style={{
            position: "relative",
            paddingTop: `0`,
            overflow: "hidden",
        }}>
      {isYoutubeVideo ?
            <RenderYoutubeVideo linkVideo={linkVideo}/> :
            <react_player_1.default ref={playerRef} onEnded={handleVideoEnded} onProgress={handleProgress} onPlay={() => startCounting()} onPause={() => pauseCounting()} className="w-full aspect-video" url={linkVideo} width="100%" height="100%" controls/>}
    </div>);
};
const RenderYoutubeVideo = ({ linkVideo }) => {
    return (<iframe src={linkVideo} frameBorder={0} allow="autoplay; encrypted-media" allowFullScreen className="w-full aspect-video rounded-xl"/>);
};
const RenderStreamableVideo = ({ linkVideo }) => {
    return (<div className="videoWrapper">
      <div style={{
            width: "100%",
            height: 0,
            position: "relative",
            paddingBottom: "62.500%",
        }}>
        <iframe className="w-full aspect-video" src={linkVideo} frameBorder={0} width="100%" height="100%" allowFullScreen style={{
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
exports.default = CoursePlayerPrivate;
