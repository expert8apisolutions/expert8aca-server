"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobCheckVideoStatus = exports.checkVideoReady = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const file_model_1 = __importDefault(require("../models/file.model"));
const vimeoApi_service_1 = require("../services/vimeoApi.service");
const vimeApi = new vimeoApi_service_1.VimeoService();
const checkVideoReady = async (assetId) => {
    const transcodeStatus = await vimeApi.getTranscodeStatus(assetId)
        .catch((error) => {
    });
    return transcodeStatus || vimeoApi_service_1.VIMEO_STATUS.IN_PROGRESS;
};
exports.checkVideoReady = checkVideoReady;
const jobCheckVideoStatus = async () => {
    const isMongoConnected = mongoose_1.default.connection.readyState === 1;
    if (isMongoConnected) {
        const fileNotHavePlaybackId = await file_model_1.default.find({
            $or: [
                { status: { $eq: "preparing" } },
            ]
        });
        if (fileNotHavePlaybackId.length > 0) {
            fileNotHavePlaybackId.forEach(async (file) => {
                if (file.assetId && (file.status === "preparing")) {
                    const videoStatus = await (0, exports.checkVideoReady)(file.assetId);
                    await file_model_1.default.findByIdAndUpdate(file._id, {
                        status: videoStatus === vimeoApi_service_1.VIMEO_STATUS.COMPLETE ? "ready" : "preparing",
                    });
                }
            });
        }
    }
};
exports.jobCheckVideoStatus = jobCheckVideoStatus;
