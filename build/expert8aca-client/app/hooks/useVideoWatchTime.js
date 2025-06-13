"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const coursesSlice_1 = require("@/redux/features/courses/coursesSlice");
const axios_1 = __importDefault(require("axios"));
const react_1 = require("react");
const react_redux_1 = require("react-redux");
function useVideoWatchTime(courseId) {
    const [watchTime, setWatchTime] = (0, react_1.useState)(0);
    const [isPlaying, setIsPlaying] = (0, react_1.useState)(false);
    const intervalRef = (0, react_1.useRef)(null);
    const dispatch = (0, react_redux_1.useDispatch)();
    (0, react_1.useEffect)(() => {
        if (isPlaying) {
            intervalRef.current = window.setInterval(() => {
                setWatchTime((prevTime) => prevTime + 1);
            }, 1000);
        }
        else if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isPlaying]);
    (0, react_1.useEffect)(() => {
        if (watchTime >= 10) {
            updateWatchTime(watchTime);
        }
        return () => { };
    }, [watchTime]);
    const updateWatchTime = async (watchTimeInSec) => {
        if (!courseId)
            return;
        try {
            const result = await axios_1.default.post(`/api/v1/update-watch-time/${courseId}`, { watchTimeInSec }, {
                withCredentials: true,
            });
            setWatchTime(0);
            dispatch((0, coursesSlice_1.updateRespTimeWatched)(result?.data?.userProgress || {}));
        }
        catch (error) {
            console.error("Failed to update watch time", error);
        }
    };
    const pauseCounting = () => {
        console.log("pauseCounting");
        setIsPlaying(false);
    };
    const startCounting = () => {
        console.log("startCounting");
        setIsPlaying(true);
    };
    return { watchTime, startCounting, pauseCounting, updateWatchTime };
}
exports.default = useVideoWatchTime;
