"use strict";
"use server";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAwsVideoId = exports.deleteVideoStreamable = exports.uploadToStreamable = void 0;
const axios_1 = __importDefault(require("axios"));
const aws_util_1 = require("../aws.util");
const uploadApiStreamableUrl = process.env.CORE_API_UPLOAD_URL;
const uploadApiStreamableKey = process.env.CORE_API_UPLOAD_KEY;
const headers = {
    'x-api-key': uploadApiStreamableKey
};
const uploadToStreamable = async (data) => {
    try {
        const body = {
            label_id: +data.labelId,
            video_url: `https://${aws_util_1.S3_BUCKET}.s3.${aws_util_1.REGION}.amazonaws.com/` + data.awsId,
            title: data.title,
        };
        const result = await axios_1.default.post(`${uploadApiStreamableUrl}/upload-streamable`, body, { headers });
        return result.data;
    }
    catch (err) {
        console.log("🚀 ~ uploadToStreamable ~ e", err);
        throw err;
    }
};
exports.uploadToStreamable = uploadToStreamable;
const deleteVideoStreamable = async (videoId) => {
    const result = await axios_1.default.delete(`${uploadApiStreamableUrl}/delete-streamable/${videoId}`, { headers });
    return result.data;
};
exports.deleteVideoStreamable = deleteVideoStreamable;
const getAwsVideoId = () => {
    const timestamp = new Date().getTime();
    const buffer = Buffer.from(timestamp.toString()).toString("base64");
    return buffer.replace(/=/g, "");
};
exports.getAwsVideoId = getAwsVideoId;
