"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLinkUploadVimeo = exports.deleteFile = exports.deleteFolder = exports.editFile = exports.getFolderAndFile = exports.addFile = exports.editFolder = exports.getSingleFolder = exports.createFolder = exports.updatePlayBackId = void 0;
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const folder_model_1 = __importDefault(require("../models/folder.model"));
const file_model_1 = __importDefault(require("../models/file.model"));
const axios_1 = __importDefault(require("axios"));
const vimeoApi_service_1 = require("../services/vimeoApi.service");
const LIMIT_STORAGE_IN_GB = +(process?.env?.LIMIT_STORAGE_IN_GB ?? 5);
const LABEL_ID = process?.env?.STREAM_LABEL_ID;
const vimeApi = new vimeoApi_service_1.VimeoService();
const deleteAssetResource = async (assetId, awsId) => {
    try {
        const result = await vimeApi.deleteVideo(assetId);
        return result;
    }
    catch (error) {
        console.error("Error during delete asset:", error);
    }
};
const findAndDeleteFile = async (fileId) => {
    const file = await file_model_1.default.findById(fileId);
    if (!file) {
        return;
    }
    if (file.assetId) {
        deleteAssetResource(file.assetId, file.awsId);
    }
    await file_model_1.default.findByIdAndDelete(fileId);
};
const recusiveDelete = async (folderId) => {
    const folder = await folder_model_1.default.findById(folderId);
    if (!folder) {
        return;
    }
    if (folder.childFolders.length > 0) {
        for (let index = 0; index < folder.childFolders.length; index++) {
            await recusiveDelete(folder.childFolders[index]._id);
        }
    }
    if (folder.childFiles.length > 0) {
        for (let index = 0; index < folder.childFiles.length; index++) {
            await findAndDeleteFile(folder.childFiles[index]._id);
        }
    }
    await folder_model_1.default.findByIdAndDelete(folderId);
};
exports.updatePlayBackId = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { assetId, playbackId } = req.body;
        const file = await file_model_1.default.findOne({
            assetId,
            status: "preparing",
        });
        if (!file) {
            return next(new ErrorHandler_1.default("File not found", 404));
        }
        file.playbackId = playbackId;
        file.status = "ready";
        await file.save();
        res.status(201).json({
            success: true,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.createFolder = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { parentId, name } = req.body;
        console.log("🚀 ~ req.body:", req.body);
        console.log("🚀 ~ name:", name);
        const folder = await folder_model_1.default.findById(parentId);
        if (!folder) {
            const result = await folder_model_1.default.create({
                name,
                parentId: null,
                childFolders: [],
                childFiles: [],
            });
            return res.status(201).json({
                success: true,
                result,
            });
        }
        const result = await folder_model_1.default.create({
            name,
            parentId,
            childFolders: [],
            childFiles: [],
        });
        folder.childFolders.push({
            _id: result._id,
        });
        await folder.save();
        res.status(201).json({
            success: true,
            folder,
        });
    }
    catch (error) {
        console.log("🚀 ~ error:", error);
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.getSingleFolder = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const folderId = req.params.id;
        const [folder, sizeInMB] = await Promise.all([
            folder_model_1.default.findById(folderId)
                .populate("childFolders")
                .populate("childFiles"),
            getSumSizeAllFile(),
        ]);
        res.status(200).json({
            success: true,
            folder,
            sizeInMB,
            sizeLimitInGB: LIMIT_STORAGE_IN_GB,
            labelId: LABEL_ID,
            sizeUsedInGB: sizeInMB / 1000,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.editFolder = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const data = req.body;
        const folderId = req.params.id;
        const folder = await folder_model_1.default.findByIdAndUpdate(folderId, {
            $set: {
                name: data.name,
            },
        }, { new: true });
        res.status(201).json({
            success: true,
            folder,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.addFile = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { name, sizeInMB, format, parentId, assetId, playbackId, status, awsId } = req.body;
        const [checkLimit] = await Promise.all([getSumSizeAllFile()]);
        if (checkLimit + (+sizeInMB) > LIMIT_STORAGE_IN_GB * 1000) {
            return next(new ErrorHandler_1.default(`Storage limit exceeded. Limit is ${LIMIT_STORAGE_IN_GB} GB`, 400));
        }
        if (parentId) {
            const folder = await folder_model_1.default.findById(parentId);
            if (!folder) {
                return next(new ErrorHandler_1.default("Folder not found", 404));
            }
            const file = {
                name,
                sizeInMB,
                format,
                parentId,
                assetId,
                playbackId,
                status: 'preparing',
                percent: 100,
                awsId,
            };
            const result = await file_model_1.default.create(file);
            folder.childFiles.push({
                _id: result._id,
            });
            await folder.save();
            res.status(200).json({
                success: true,
                result,
            });
        }
        else {
            const file = {
                name,
                sizeInMB,
                format,
                parentId: null,
                assetId,
                playbackId,
                status: 'preparing',
                percent: 100,
                awsId
            };
            const result = await file_model_1.default.create(file);
            res.status(200).json({
                success: true,
                result,
            });
        }
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
const getSumSizeAllFile = async () => {
    try {
        const result = await file_model_1.default.aggregate([
            {
                $group: {
                    _id: null,
                    sizeInMB: { $sum: "$sizeInMB" }
                }
            }
        ]);
        if (result.length > 0) {
            return result[0].sizeInMB;
        }
        else {
            return 0;
        }
    }
    catch (err) {
        console.error('Error during aggregation:', err);
    }
};
exports.getFolderAndFile = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const folderId = req.params.id;
        if (folderId) {
            const folder = await folder_model_1.default.findById(folderId)
                .populate("childFolders")
                .populate("childFiles", "name size");
            if (!folder) {
                return next(new ErrorHandler_1.default("Folder not found", 404));
            }
            res.status(200).json({
                success: true,
                folder,
            });
        }
        else {
            const [folders, files, sizeInMB] = await Promise.all([
                folder_model_1.default.find({
                    parentId: null,
                })
                    .populate("childFolders")
                    .populate("childFiles", "name size"),
                file_model_1.default.find({
                    parentId: null,
                }),
                getSumSizeAllFile(),
            ]);
            res.status(200).json({
                success: true,
                folders,
                files,
                sizeInMB,
                sizeLimitInGB: LIMIT_STORAGE_IN_GB,
                labelId: LABEL_ID,
                sizeUsedInGB: sizeInMB / 1000,
            });
        }
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.editFile = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { name } = req.body;
        const fileId = req.params.id;
        const file = await file_model_1.default.findByIdAndUpdate(fileId, {
            $set: {
                name,
            },
        }, { new: true });
        res.status(201).json({
            success: true,
            file,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.deleteFolder = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const folderId = req.params.id;
        const folder = await folder_model_1.default.findById(folderId);
        if (!folder) {
            return next(new ErrorHandler_1.default("Folder not found", 404));
        }
        await recusiveDelete(folderId); // Add recursive delete
        await folder_model_1.default.findByIdAndDelete(folderId);
        res.status(200).json({
            success: true,
            message: "Folder deleted successfully",
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
exports.deleteFile = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const fileId = req.params.id;
        const file = await file_model_1.default.findById(fileId);
        if (!file) {
            return next(new ErrorHandler_1.default("File not found", 404));
        }
        // await FileModel.findByIdAndDelete(fileId);
        findAndDeleteFile(fileId);
        res.status(200).json({
            success: true,
            message: "File deleted successfully",
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
exports.getLinkUploadVimeo = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { name, size } = req.body;
        const response = await (0, axios_1.default)({
            method: 'POST',
            url: 'https://api.vimeo.com/me/videos',
            headers: {
                Authorization: `Bearer ${process.env.VIMEO_ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            },
            data: {
                upload: {
                    approach: 'tus',
                    size: size,
                },
                name: name,
            }
        });
        const linkUpload = response.data.upload.upload_link;
        const linkVideo = response.data.player_embed_url;
        const videoId = response.data.uri?.replace('/videos/', '');
        const folderId = process.env.VIMEO_FOLDER_ID;
        if (folderId && videoId) {
            await (0, axios_1.default)({
                method: 'PUT',
                url: `https://api.vimeo.com/me/projects/${folderId}/videos/${videoId}`,
                headers: {
                    Authorization: `Bearer ${process.env.VIMEO_ACCESS_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            }).then((response) => {
                console.log("🚀 ~ move folder:", response.data);
            });
        }
        res.status(200).json({
            success: true,
            upload_link: linkUpload,
            link: linkVideo,
            videoId,
            data: response.data
        });
    }
    catch (error) {
        console.log("🚀 ~ error:", error);
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
