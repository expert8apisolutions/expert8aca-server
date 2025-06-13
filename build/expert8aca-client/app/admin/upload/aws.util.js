"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.s3 = exports.AWS_SECRET_ACCESS_KEY = exports.AWS_ACCESS_KEY_ID = exports.REGION = exports.S3_BUCKET = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
exports.S3_BUCKET = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME;
// S3 Region
exports.REGION = process.env.NEXT_PUBLIC_AWS_REGION;
exports.AWS_ACCESS_KEY_ID = process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID;
exports.AWS_SECRET_ACCESS_KEY = process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY;
// S3 Credentials
aws_sdk_1.default.config.update({
    accessKeyId: exports.AWS_ACCESS_KEY_ID,
    secretAccessKey: exports.AWS_SECRET_ACCESS_KEY,
});
exports.s3 = new aws_sdk_1.default.S3({
    params: { Bucket: exports.S3_BUCKET },
    region: exports.REGION,
});
