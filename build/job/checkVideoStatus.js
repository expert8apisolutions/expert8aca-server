"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobCheckVideoStatus = exports.checkVideoReady = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const file_model_1 = __importDefault(require("../models/file.model"));
const axios_1 = __importDefault(require("axios"));
const headerApi_1 = require("../utils/headerApi");
const checkVideoReady = async (assetId) => {
    const result = await axios_1.default.get(`${process.env.CORE_API_UPLOAD_URL}/detail-video/${assetId}`, { headers: headerApi_1.headerApiKey });
    return {
        percent: result.data.percent || 0,
    };
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
                    const percent = await (0, exports.checkVideoReady)(file.assetId);
                    await file_model_1.default.findByIdAndUpdate(file._id, {
                        status: percent.percent === 100 ? "ready" : "preparing",
                        percent: percent.percent || 0,
                    });
                }
            });
        }
    }
};
exports.jobCheckVideoStatus = jobCheckVideoStatus;
