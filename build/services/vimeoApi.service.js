"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VimeoService = exports.VIMEO_STATUS = void 0;
const axios_1 = __importDefault(require("axios"));
const baseUrl = "https://api.vimeo.com";
const vimeoAccessToken = process.env.VIMEO_ACCESS_TOKEN ?? '';
const axiosInstance = axios_1.default.create({
    baseURL: baseUrl,
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${vimeoAccessToken}`,
    },
});
exports.VIMEO_STATUS = {
    IN_PROGRESS: "in_progress",
    COMPLETE: "complete"
};
class VimeoService {
    constructor() { }
    async getTranscodeStatus(videoId) {
        try {
            // const response = await axios({
            //     method: 'GET',
            //     url: `https://api.vimeo.com/videos/${videoId}`,
            //     headers: {
            //         Authorization: `Bearer ${process.env.VIMEO_ACCESS_TOKEN}`,
            //         'Content-Type': 'application/json'
            //     }
            // });
            const response = await axiosInstance.get(`/videos/${videoId}`);
            return response.data.transcode.status;
        }
        catch (error) {
            throw new Error(error?.response?.data?.message || error?.message || "Failed to get transcode status");
        }
    }
    async deleteVideo(videoId) {
        try {
            await axiosInstance.delete(`/videos/${videoId}`).then((response) => {
                console.log("🚀 ~ VimeoService ~ deleteVideo ~ response", response.data);
            });
        }
        catch (error) {
            throw new Error(error?.response?.data?.message || error?.message || "Failed to delete video");
        }
    }
}
exports.VimeoService = VimeoService;
