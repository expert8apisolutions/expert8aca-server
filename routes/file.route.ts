import express from "express";
import { authorizeRoles, isAutheticated } from "../middleware/auth";
import { addFile, createFolder, deleteFile, deleteFolder, editFile, editFolder, getFolderAndFile, getSingleFolder } from "../controllers/file.controller";

const fileRouter = express.Router();

fileRouter.get(
    "/file/get-folders-files/:id?",
    getFolderAndFile,
);

fileRouter.post(
    "/file/get-folder/:id",
    getSingleFolder,
);

fileRouter.post(
    "/file/create-folder",
    createFolder,
);

fileRouter.post(
    "/file/create-file",
    addFile,
);

fileRouter.post(
    "/file/edit-file/:id",
    editFile,
);
fileRouter.post(
    "/file/edit-folder/:id",
    editFolder,
);
fileRouter.delete(
    "/file/delete-folder/:id",
    deleteFolder,
);
fileRouter.delete(
    "/file/delete-file/:id",
    deleteFile,
);
export default fileRouter;
