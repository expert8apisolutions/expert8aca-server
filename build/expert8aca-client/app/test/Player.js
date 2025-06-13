"use strict";
"use client";
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
const react_hot_toast_1 = __importDefault(require("react-hot-toast"));
const react_player_1 = __importDefault(require("react-player"));
const videoUrl = 'https://streamable.com/62ve05';
const videoList = [
    'https://streamable.com/62ve05',
    'https://streamable.com/r1atm3',
    'https://streamable.com/55xrit',
    'https://streamable.com/iwhyeo'
];
const Player = () => {
    const playerRef = (0, react_1.useRef)(null);
    const [selectedVideo, setSelectedVideo] = react_1.default.useState(videoUrl);
    const handleVideoEnded = () => {
        react_hot_toast_1.default.success('Video Ended');
    };
    const handleNextVideoLoop = () => {
        const currentIndex = videoList.indexOf(selectedVideo);
        if (currentIndex === videoList.length - 1) {
            setSelectedVideo(videoList[0]);
        }
        else {
            setSelectedVideo(videoList[currentIndex + 1]);
        }
    };
    return (<div className='max-w-[600px] w-full mr-auto'>
            <react_player_1.default ref={playerRef} onEnded={handleVideoEnded} 
    // onProgress={handleProgress}
    // playing={isPlaying}
    className="w-full aspect-video" url={selectedVideo} width="100%" height="100%" controls/>
            <button className='text-2xl text-black' onClick={handleNextVideoLoop}>Next video</button>
        </div>);
};
exports.default = Player;
