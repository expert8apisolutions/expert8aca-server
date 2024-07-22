import express from "express";
import { authorizeRoles, isAutheticated } from "../middleware/auth";
import { addFile, createFolder, deleteFile, deleteFolder, editFile, editFolder, getFolderAndFile, getLinkUploadVimeo, getSingleFolder, getVideoTranscodeStatus, updatePlayBackId } from "../controllers/file.controller";

const fileRouter = express.Router();

fileRouter.get(
    "/file/get-folders-files/:id?",
    isAutheticated, 
    authorizeRoles("admin"),
    getFolderAndFile,
);

fileRouter.post(
    "/file/get-folder/:id",
    isAutheticated, 
    authorizeRoles("admin"),
    getSingleFolder,
);

fileRouter.post(
    "/file/create-folder",
    isAutheticated, 
    authorizeRoles("admin"),
    createFolder,
);

fileRouter.post(
    "/file/create-file",
    isAutheticated, 
    authorizeRoles("admin"),
    addFile,
);

fileRouter.post(
    "/file/edit-file/:id",
    isAutheticated, 
    authorizeRoles("admin"),
    editFile,
);
fileRouter.post(
    "/file/edit-folder/:id",
    isAutheticated, 
    authorizeRoles("admin"),
    editFolder,
);
fileRouter.delete(
    "/file/delete-folder/:id",
    isAutheticated, 
    authorizeRoles("admin"),
    deleteFolder,
);
fileRouter.delete(
    "/file/delete-file/:id",
    isAutheticated, 
    authorizeRoles("admin"),
    deleteFile,
);
fileRouter.post(
    "/file/update-playback",
    isAutheticated, 
    authorizeRoles("admin"),
    updatePlayBackId,
);

fileRouter.post(
    "/file/get-link-upload",
    isAutheticated, 
    authorizeRoles("admin"),
    getLinkUploadVimeo,
);
export default fileRouter;
