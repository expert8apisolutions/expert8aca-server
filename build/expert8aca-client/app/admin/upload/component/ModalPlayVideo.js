"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModalPlayVideo = void 0;
const flowbite_react_1 = require("flowbite-react");
const FileManager_1 = require("../FileManager");
const CoursePlayer_1 = __importDefault(require("@/app/utils/CoursePlayer"));
const ModalPlayVideo = ({ open, onClose, playbackId, assetId, refresh, status }) => {
    return (<flowbite_react_1.Modal show={open} onClose={onClose} size={"4xl"}>
            <flowbite_react_1.Modal.Header>Play Video</flowbite_react_1.Modal.Header>
            <flowbite_react_1.Modal.Body className="p-1 overflow-hidden">
                {(assetId && status === FileManager_1.VideoStatus.READY) && <CoursePlayer_1.default videoUrl={playbackId} title=""/>}
                {status === FileManager_1.VideoStatus.PREPARING && <p className="text-black font-bold text-center">Preparing video...</p>}
            </flowbite_react_1.Modal.Body>
        </flowbite_react_1.Modal>);
};
exports.ModalPlayVideo = ModalPlayVideo;
