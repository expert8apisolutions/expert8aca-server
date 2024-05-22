"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
const http_1 = __importDefault(require("http"));
const db_1 = __importDefault(require("./utils/db"));
const socketServer_1 = require("./socketServer");
const app_1 = require("./app");
const node_cron_1 = __importDefault(require("node-cron"));
const mongoose_1 = __importDefault(require("mongoose"));
const file_model_1 = __importDefault(require("./models/file.model"));
const mux_service_1 = require("./services/mux.service");
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
node_cron_1.default.schedule(`*/${cronJobInMinute} * * * *`, async () => {
    console.log(` cronjob running every ${cronJobInMinute} minutes `);
    const isMongoConnected = mongoose_1.default.connection.readyState === 1;
    if (isMongoConnected) {
        const fileNotHavePlaybackId = await file_model_1.default.find({
            $or: [
                { playbackId: { $eq: null } },
                { playbackId: { $eq: "" } }
            ]
        });
        console.log('fond file without playbackId ', fileNotHavePlaybackId.length);
        if (fileNotHavePlaybackId.length > 0) {
            fileNotHavePlaybackId.forEach(async (file) => {
                if (file.assetId) {
                    const status = await (0, mux_service_1.checkAssetStatus)(file.assetId);
                    if (status.playbackId) {
                        await file_model_1.default.findByIdAndUpdate(file._id, {
                            playbackId: status.playbackId,
                        });
                    }
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
