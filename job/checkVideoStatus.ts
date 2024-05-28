import mongoose from "mongoose";
import FileModel, { IFile } from "../models/file.model";
import axios from "axios";
import { headerApiKey } from "../utils/headerApi";

export const checkVideoReady = async (assetId: string) => {
    const result = await axios.get(`${process.env.CORE_API_UPLOAD_URL}/detail-video/${assetId}`, { headers: headerApiKey });
    return {
        percent: result.data.percent || 0,
    }
}

export const jobCheckVideoStatus = async () => {
    const isMongoConnected = mongoose.connection.readyState === 1;
    if (isMongoConnected) {
        const fileNotHavePlaybackId: IFile[] = await FileModel.find({
            $or: [
                { status: { $eq: "preparing" } },
            ]
        });
        if (fileNotHavePlaybackId.length > 0) {
            fileNotHavePlaybackId.forEach(async (file) => {
                if (file.assetId && (file.status === "preparing")) {
                    const percent = await checkVideoReady(file.assetId);
                    await FileModel.findByIdAndUpdate(file._id, {
                        status: percent.percent === 100 ? "ready" : "preparing",
                        percent: percent.percent || 0,
                    });
                }
            })
        }
    }
}