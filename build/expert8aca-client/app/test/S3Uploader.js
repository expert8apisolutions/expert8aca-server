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
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const lib_storage_1 = require("@aws-sdk/lib-storage");
const client_s3_1 = require("@aws-sdk/client-s3");
const aws_util_1 = require("../admin/upload/aws.util");
const S3Uploader = () => {
    const [uploadProgress, setUploadProgress] = (0, react_1.useState)(0);
    function fileChange(e) {
        var file = e.target.files[0];
        const target = { Bucket: aws_util_1.S3_BUCKET, Key: file.name, Body: file };
        const creds = { accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID, secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY };
        try {
            const parallelUploadS3 = new lib_storage_1.Upload({
                client: new client_s3_1.S3Client({ region: aws_util_1.REGION, credentials: creds }),
                leavePartsOnError: false,
                params: target,
            });
            parallelUploadS3.on("httpUploadProgress", (progress) => {
                const percentage = Math.round((progress.loaded / progress.total) * 100);
                setUploadProgress(percentage);
            });
            parallelUploadS3.done().then((data) => {
                console.log('upload success', data);
            });
        }
        catch (e) {
            console.log(e);
        }
    }
    return (<div className='text-black'>
            <input type="file" onChange={fileChange}/>
             <div>Upload Progress: {uploadProgress}%</div>
        </div>);
};
exports.default = S3Uploader;
