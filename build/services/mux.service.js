"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAssetStatus = void 0;
const mux_node_1 = __importDefault(require("@mux/mux-node"));
const mux = new mux_node_1.default();
const checkAssetStatus = async (assetId) => {
    const asset = await mux.video.assets.retrieve(assetId);
    console.log("🚀 ~ checkAssetStatus ~ asset:", asset);
    const playbackIds = asset.playback_ids;
    if (Array.isArray(playbackIds)) {
        const playbackId = playbackIds.find((id) => id.policy === "public");
        if (playbackId) {
            return {
                status: asset.status,
                errors: asset.errors,
                playbackId: playbackId.id,
            };
        }
    }
    return {
        status: asset.status,
        errors: asset.errors,
        playbackId: '',
    };
};
exports.checkAssetStatus = checkAssetStatus;
