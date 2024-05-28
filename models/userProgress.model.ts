import mongoose, { Document, Model, Schema } from "mongoose";

interface IVideoCompleated {
    video_id: String,
}


export interface IUserProgress extends Document {
    user_id: String,
    course_id: String,
    video_compleated_id: IVideoCompleated[],
    current_video_id: String,
    current_video_time: Number,
}

const userProgressSchema: Schema<IUserProgress> = new mongoose.Schema(
    {
        user_id: {
            type: String,
            required: true,
        },
        course_id: {
            type: String,
            required: true,
        },
        video_compleated_id: [
            {
                video_id: String,
            },
        ],
        current_video_id: {
            type: String,
            required: true,
        },
        current_video_time: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

const userProgressModel: Model<IUserProgress> = mongoose.model("User_progress", userProgressSchema);

export default userProgressModel;