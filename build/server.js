"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkVideoReady = void 0;
const cloudinary_1 = require("cloudinary");
const http_1 = __importDefault(require("http"));
const db_1 = __importDefault(require("./utils/db"));
const socketServer_1 = require("./socketServer");
const app_1 = require("./app");
const node_cron_1 = __importDefault(require("node-cron"));
const mongoose_1 = __importDefault(require("mongoose"));
const file_model_1 = __importDefault(require("./models/file.model"));
const axios_1 = __importDefault(require("axios"));
require("dotenv").config();
const server = http_1.default.createServer(app_1.app);
// cloudinary config  
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_SECRET_KEY,
});
(0, socketServer_1.initSocketServer)(server);
const cronJobInMinute = process.env.MUX_CRONJOB_CHECK_IN_MINUTE;
const checkVideoReady = async (assetId) => {
    const result = await axios_1.default.get(`${process.env.CORE_API_UPLOAD_URL}/detail-video/${assetId}`);
    return {
        percent: result.data.percent || 0,
    };
};
exports.checkVideoReady = checkVideoReady;
node_cron_1.default.schedule(`*/${cronJobInMinute} * * * *`, async () => {
    console.log(` cronjob running every ${cronJobInMinute} minutes `);
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
});
// create server
server.listen(process.env.PORT, () => {
    console.log(`Server is connected with port ${process.env.PORT}`);
    (0, db_1.default)();
});
