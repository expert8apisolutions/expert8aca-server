import axios from "axios";

const baseUrl = "https://api.vimeo.com";

const vimeoAccessToken = process.env.VIMEO_ACCESS_TOKEN ?? '';

const axiosInstance = axios.create({
    baseURL: baseUrl,
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${vimeoAccessToken}`,
    },
});

export const VIMEO_STATUS = {
    IN_PROGRESS: "in_progress",
    COMPLETE: "complete"
}

export class VimeoService {
    constructor() { }

    async getTranscodeStatus(videoId: string): Promise<any> {
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

            return response.data.transcode.status
        } catch (error: any) {
            throw new Error(error?.response?.data?.message || error?.message || "Failed to get transcode status");
        }
    }

    async deleteVideo(videoId: string): Promise<void> {
        try {
            await axiosInstance.delete(`/videos/${videoId}`).then((response) => {
                console.log("🚀 ~ VimeoService ~ deleteVideo ~ response", response.data)
            })
        } catch (error: any) {
            throw new Error(error?.response?.data?.message || error?.message || "Failed to delete video");
        }
    }
}
