import mongoose from "mongoose";
import FileModel, { IFile } from "../models/file.model";
import axios from "axios";
import { headerApiKey } from "../utils/headerApi";
import { VIMEO_STATUS, VimeoService } from "../services/vimeoApi.service";

const vimeApi = new VimeoService()

export const checkVideoReady = async (assetId: string) => {
    const transcodeStatus = await vimeApi.getTranscodeStatus(assetId)
        .catch((error) => {
        })
    return transcodeStatus || VIMEO_STATUS.IN_PROGRESS;
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
                    const videoStatus = await checkVideoReady(file.assetId);
                    await FileModel.findByIdAndUpdate(file._id, {
                        status: videoStatus === VIMEO_STATUS.COMPLETE ? "ready" : "preparing",
                    });
                }
            })
        }
    }
}