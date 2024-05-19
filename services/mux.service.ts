import Mux from "@mux/mux-node";
import type MuxType from "@mux/mux-node";

const mux = new Mux();


export type Status = {
  status: MuxType.Video.Assets.Asset["status"];
  errors: MuxType.Video.Assets.Asset["errors"];
  playbackId: string;
};


export const checkAssetStatus = async (assetId: string): Promise<Status> => {
    const asset = await mux.video.assets.retrieve(assetId);
    if (asset.status === "ready") {
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
    }

    return {
        status: asset.status,
        errors: asset.errors,
        playbackId: '',
    };
};