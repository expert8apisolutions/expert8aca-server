import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import FolderModel, { IFolder } from "../models/folder.model";
import FileModel from "../models/file.model";
import { checkVideoReady } from "../server";
import axios from "axios";

const LIMIT_STORAGE_IN_GB = +(process?.env?.LIMIT_STORAGE_IN_GB ?? 5);

const deleteAssetResource = async (assetId: string, awsId: string) => {
    try {
        const result = await axios.post(`${process.env.CORE_API_UPLOAD_URL}/delete-asset`,{
            assetId,
            awsId,
        });
        return result;
    } catch (error) {
        console.error("Error during delete asset:", error);
    }
}

const findAndDeleteFile = async (fileId: string) => {
    const file: any = await FileModel.findById(fileId);
    if (!file) {
        return;
    }
    if (file.assetId && file.awsId) {
        deleteAssetResource(file.assetId, file.awsId);
    }
    await FileModel.findByIdAndDelete(fileId);

}
const recusiveDelete = async (folderId: string) => {
    const folder: any = await FolderModel.findById(folderId);
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
            await findAndDeleteFile(folder.childFiles[index]._id)
        }
    }
    await FolderModel.findByIdAndDelete(folderId);
};

export const updatePlayBackId = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { assetId, playbackId } = req.body;
            const file = await FileModel.findOne({
                assetId,
                status: "preparing",
            });

            if (!file) {
                return next(new ErrorHandler("File not found", 404));
            }

            file.playbackId = playbackId;
            file.status = "ready";
            await file.save();
            res.status(201).json({
                success: true,
            });
        }
        catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
)

export const createFolder = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { parentId, name }: IFolder = req.body;
            console.log("🚀 ~ req.body:", req.body);
            console.log("🚀 ~ name:", name);

            const folder: any = await FolderModel.findById(parentId);
            if (!folder) {
                const result = await FolderModel.create({
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

            const result = await FolderModel.create({
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
        } catch (error: any) {
            console.log("🚀 ~ error:", error);
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

export const getSingleFolder = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const folderId = req.params.id;
            const [folder, sizeInMB] = await Promise.all([
                FolderModel.findById(folderId)
                    .populate("childFolders")
                    .populate("childFiles"),
                getSumSizeAllFile(),
            ]);
            res.status(200).json({
                success: true,
                folder,
                sizeInMB,
                sizeLimitInGB: LIMIT_STORAGE_IN_GB,
                sizeUsedInGB: sizeInMB / 1000,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

export const editFolder = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data: IFolder = req.body;
            const folderId = req.params.id;
            const folder = await FolderModel.findByIdAndUpdate(
                folderId,
                {
                    $set: {
                        name: data.name,
                    },
                },
                { new: true }
            );

            res.status(201).json({
                success: true,
                folder,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

export const addFile = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { name, sizeInMB, format, parentId, assetId, playbackId, status, awsId } =
                req.body;

            const [checkLimit, checkPercent] = await Promise.all([getSumSizeAllFile(), checkVideoReady(assetId)])
            if (checkLimit + sizeInMB > LIMIT_STORAGE_IN_GB * 1000) {
                return next(
                    new ErrorHandler(
                        `Storage limit exceeded. Limit is ${LIMIT_STORAGE_IN_GB} GB`,
                        400
                    )
                );
            }
            if (parentId) {
                const folder: any = await FolderModel.findById(parentId);
                if (!folder) {
                    return next(new ErrorHandler("Folder not found", 404));
                }

                const file = {
                    name,
                    sizeInMB,
                    format,
                    parentId,
                    assetId,
                    playbackId,
                    status,
                    percent: checkPercent.percent || 0,
                    awsId,
                };
                const result = await FileModel.create(file);
                folder.childFiles.push({
                    _id: result._id,
                });
                await folder.save();
                res.status(200).json({
                    success: true,
                    result,
                });
            } else {
                const file = {
                    name,
                    sizeInMB,
                    format,
                    parentId: null,
                    assetId,
                    playbackId,
                    status,
                    percent: checkPercent.percent || 0,
                    awsId
                };
                const result = await FileModel.create(file);
                res.status(200).json({
                    success: true,
                    result,
                });
            }
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

const getSumSizeAllFile = async () => {
    try {
        const result = await FileModel.aggregate([
            {
                $group: {
                    _id: null,
                    sizeInMB: { $sum: "$sizeInMB" }
                }
            }
        ]);

        if (result.length > 0) {
            return result[0].sizeInMB;
        } else {
            return 0
        }
    } catch (err) {
        console.error('Error during aggregation:', err);
    }
}

export const getFolderAndFile = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const folderId = req.params.id;
            if (folderId) {
                const folder = await FolderModel.findById(folderId)
                    .populate("childFolders")
                    .populate("childFiles", "name size");
                if (!folder) {
                    return next(new ErrorHandler("Folder not found", 404));
                }
                res.status(200).json({
                    success: true,
                    folder,
                });
            } else {
                const [folders, files, sizeInMB] = await Promise.all([
                    FolderModel.find({
                        parentId: null,
                    })
                        .populate("childFolders")
                        .populate("childFiles", "name size"),
                    FileModel.find({
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
                    sizeUsedInGB: sizeInMB / 1000,
                });
            }
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

export const deleteFileInFolder = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const fileId = req.params.id;
            const file = await FileModel.findById(fileId);
            if (!file) {
                return next(new ErrorHandler("File not found", 404));
            }
            await file.deleteOne({ id: fileId });
            findAndDeleteFile(fileId);
            res.status(200).json({
                success: true,
                message: "File deleted successfully",
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400));
        }
    }
);

export const editFile = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { name } = req.body;
            const fileId = req.params.id;
            const file = await FileModel.findByIdAndUpdate(
                fileId,
                {
                    $set: {
                        name,
                    },
                },
                { new: true }
            );

            res.status(201).json({
                success: true,
                file,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

export const deleteFolder = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const folderId = req.params.id;
            const folder = await FolderModel.findById(folderId);
            if (!folder) {
                return next(new ErrorHandler("Folder not found", 404));
            }
            await recusiveDelete(folderId); // Add recursive delete
            await FolderModel.findByIdAndDelete(folderId);
            res.status(200).json({
                success: true,
                message: "Folder deleted successfully",
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400));
        }
    }
);

export const deleteFile = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const fileId = req.params.id;
            const file = await FileModel.findById(fileId);
            if (!file) {
                return next(new ErrorHandler("File not found", 404));
            }
            await FileModel.findByIdAndDelete(fileId);
            findAndDeleteFile(fileId);
            res.status(200).json({
                success: true,
                message: "File deleted successfully",
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400));
        }
    }
);
