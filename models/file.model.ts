import mongoose, { Document, Model, Schema } from "mongoose";

export interface IFile extends Document {
    name: string;
    sizeInMB: number;
    format: string;
    parentId: string | null;
    playbackId?: string | null;
    assetId?: string;
    status?: string;
}

const fileSchema = new Schema<IFile>({
    name: {
        type: String,
        required: true
    },
    sizeInMB: {
        type: Number,
        required: true
    },
    format: {
        type: String,
        required: true
    },
    status: {
        type: String,
    },
    assetId: {
        type: String,
        required: true
    },
    playbackId: {
        type: String,
        required: false,
        default: null,
    },
    parentId: {
        type: String,
        required: false,
        default: null,
        ref: 'Folder',
    }
}, { timestamps: true });


const FileModel: Model<IFile> = mongoose.model('File', fileSchema);

export default FileModel;




