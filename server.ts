import { v2 as cloudinary } from "cloudinary";
import http from "http";
import connectDB from "./utils/db";
import { initSocketServer } from "./socketServer";
import { app } from "./app";
import cron from 'node-cron';
import mongoose from "mongoose";
import FileModel, { IFile } from "./models/file.model";
import { checkAssetStatus } from "./services/mux.service";
import axios from "axios";
import { headerApiKey } from "./utils/headerApi";
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

export const checkVideoReady = async (assetId: string) => {
    const result = await axios.get(`${process.env.CORE_API_UPLOAD_URL}/detail-video/${assetId}`, { headers: headerApiKey });
    return {
        percent: result.data.percent || 0,
    }
}

cron.schedule(`*/${cronJobInMinute} * * * *`, async () => {
    console.log(` cronjob running every ${cronJobInMinute} minutes `)
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
                    const percent = await checkVideoReady(file.assetId);
                    await FileModel.findByIdAndUpdate(file._id, {
                        status: percent.percent === 100 ? "ready" : "preparing",
                        percent: percent.percent || 0,
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
