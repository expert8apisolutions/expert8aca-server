"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const file_controller_1 = require("../controllers/file.controller");
const fileRouter = express_1.default.Router();
fileRouter.get("/file/get-folders-files/:id?", auth_1.isAutheticated, (0, auth_1.authorizeRoles)("admin"), file_controller_1.getFolderAndFile);
fileRouter.post("/file/get-folder/:id", auth_1.isAutheticated, (0, auth_1.authorizeRoles)("admin"), file_controller_1.getSingleFolder);
fileRouter.post("/file/create-folder", auth_1.isAutheticated, (0, auth_1.authorizeRoles)("admin"), file_controller_1.createFolder);
fileRouter.post("/file/create-file", auth_1.isAutheticated, (0, auth_1.authorizeRoles)("admin"), file_controller_1.addFile);
fileRouter.post("/file/edit-file/:id", auth_1.isAutheticated, (0, auth_1.authorizeRoles)("admin"), file_controller_1.editFile);
fileRouter.post("/file/edit-folder/:id", auth_1.isAutheticated, (0, auth_1.authorizeRoles)("admin"), file_controller_1.editFolder);
fileRouter.delete("/file/delete-folder/:id", auth_1.isAutheticated, (0, auth_1.authorizeRoles)("admin"), file_controller_1.deleteFolder);
fileRouter.delete("/file/delete-file/:id", auth_1.isAutheticated, (0, auth_1.authorizeRoles)("admin"), file_controller_1.deleteFile);
fileRouter.post("/file/update-playback", auth_1.isAutheticated, (0, auth_1.authorizeRoles)("admin"), file_controller_1.updatePlayBackId);
exports.default = fileRouter;
