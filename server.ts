import { v2 as cloudinary } from "cloudinary";
import http from "http";
import connectDB from "./utils/db";
import { initSocketServer } from "./socketServer";
import { app } from "./app";
import cron from 'node-cron';
import mongoose from "mongoose";
import FileModel, { IFile } from "./models/file.model";
import { checkAssetStatus } from "./services/mux.service";
require("dotenv").config();
const server = http.createServer(app);


// cloudinary config  
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_SECRET_KEY,
});

initSocketServer(server);

const cronJobInMinute = process.env.MUX_CRONJOB_CHECK_IN_MINUTE

cron.schedule(`*/${cronJobInMinute} * * * *`, async () => {
    console.log(` cronjob running every ${cronJobInMinute} minutes `)
    const isMongoConnected = mongoose.connection.readyState === 1;
    if (isMongoConnected) {
        const fileNotHavePlaybackId: IFile[] = await FileModel.find({
            $or: [
                { playbackId: { $eq: null } },
                { playbackId: { $eq: "" } },
                { status: { $eq: "preparing" } },
            ]
        });
        if (fileNotHavePlaybackId.length > 0) {
            fileNotHavePlaybackId.forEach(async (file) => {
                if (file.assetId && (file.status === "preparing" || !file.playbackId)) {
                    const status = await checkAssetStatus(file.assetId);
                    await FileModel.findByIdAndUpdate(file._id, {
                        playbackId: status.playbackId || null,
                        status: status.status
                    });
                }
            })
        }
    }
});

// create server
server.listen(process.env.PORT, () => {
    console.log(`Server is connected with port ${process.env.PORT}`);
    connectDB();
});
