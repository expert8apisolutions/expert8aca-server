import mongoose, { Document, Model, Schema } from "mongoose";

export interface IFolder extends Document {
    name: string;
    parentId: string | null;
    childFolders: [object] | [];
    childFiles: [object] | [];

}

const folderSchema = new Schema<IFolder>({
    name: {
        type: String,
        required: true
    },
    parentId: {
        type: String,
        required: false,
        default: null,
        ref: 'Folder',
    },
    childFolders: [{
        type: Schema.Types.ObjectId,
        ref: 'Folder'
    }],
    childFiles: [{
        type: Schema.Types.ObjectId,
        ref: 'File'
    }]
}, { timestamps: true });


const FolderModel: Model<IFolder> = mongoose.model('Folder', folderSchema);

export default FolderModel;