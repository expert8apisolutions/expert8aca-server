"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_s3_1 = require("@aws-sdk/client-s3");
const uuid_1 = require("uuid");
// let R2_ACCESS_KEY_ID = 'c63552be1b5dfd5a6ae3bde36834bfab'
// let R2_SECRET_ACCESS_KEY = 'e5b48aecf229e4d6b9ec96ee09673f6b65d8fbb05ebd2669f53a89750ca1e676'
// let R2_BUCKET_NAME = "r2academy"
// let R2_ACCOUNT = 'dc522383d30eeaa021f0dfdabaa363f4'
// let R2_ENDPOINT = `https://${R2_ACCOUNT}.r2.cloudflarestorage.com`
// let R2_PUBLIC_URL = `https://pub-4f46f50c4d4c4a8e8a4158a3317d6692.r2.dev`
const s3 = new client_s3_1.S3Client({
    region: 'auto',
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    },
});
function base64ToBuffer(base64String) {
    const matches = base64String.match(/^data:(.+);base64,(.+)$/);
    if (matches) {
        return Buffer.from(matches[2], 'base64');
    }
    else {
        return Buffer.from(base64String, 'base64');
    }
}
function getContentType(base64String) {
    const matches = base64String.match(/^data:(.+);base64,/);
    if (matches && matches.length > 1) {
        return matches[1];
    }
    return 'application/octet-stream';
}
function generateKey(originalFileName) {
    const uuid = (0, uuid_1.v4)();
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const date = `${year}${month}${day}`;
    return `${uuid}_${date}.${originalFileName}`;
}
async function uploadBase64File(base64String) {
    return new Promise(async (resolve, reject) => {
        try {
            const fileBuffer = base64ToBuffer(base64String);
            const contentType = getContentType(base64String);
            const uploadKey = generateKey(contentType.split('/')[1]);
            const params = {
                Bucket: process.env.R2_BUCKET_NAME,
                Key: uploadKey,
                Body: fileBuffer,
                ContentType: contentType,
                ACL: "public-read",
            };
            const command = new client_s3_1.PutObjectCommand(params);
            const response = await s3.send(command);
            const url = `${process.env.R2_PUBLIC_URL}/${uploadKey}`;
            resolve(url);
        }
        catch (error) {
            console.error("การอัพโหลดล้มเหลว:", error);
            reject(error);
        }
    });
}
exports.default = uploadBase64File;
