import mongoose, { Document, Model, Schema } from "mongoose";
import { IUser } from "./user.model";

export interface IComment extends Document {
  user: IUser;
  question: string;
  questionReplies: IComment[];
}

interface IReview extends Document {
  user: IUser;
  rating?: number;
  comment: string;
  commentReplies?: IReview[];
}

interface ILink extends Document {
  title: string;
  url: string;
}

interface ICourseData extends Document {
  title: string;
  description: string;
  videoUrl: string;
  videoThumbnail: object;
  videoSection: string;
  videoLength: number;
  videoPlayer: string;
  links: ILink[];
  suggestion: string;
  questions: IComment[];
}

interface IQuiz extends Document {
  preTestEnabled?: boolean;
  preTestTitle?: string;
  preTestId?: mongoose.Types.ObjectId;
  postTestEnabled?: boolean;
  postTestTitle?: string;
  postTestId?: mongoose.Types.ObjectId;
}

export interface ICourse extends Document {
  name: string;
  description: string;
  categories: string;
  price: number;
  estimatedPrice?: number;
  thumbnail: object;
  tags: string;
  level: string;
  demoUrl: string;
  benefits: { title: string }[];
  prerequisites: { title: string }[];
  limitWatchedTime?: number;
  reviews: IReview[];
  courseData: ICourseData[];
  ratings?: number;
  purchased: number;
  status: string;
  quiz?: IQuiz;
  certificate?: string
}

const reviewSchema = new Schema<IReview>({
  user: Object,
  rating: {
    type: Number,
    default: 0,
  },
  comment: String,
  commentReplies: [Object],
}, { timestamps: true });

const linkSchema = new Schema<ILink>({
  title: String,
  url: String,
});

const commentSchema = new Schema<IComment>({
  user: Object,
  question: String,
  questionReplies: [Object],
}, { timestamps: true });

const courseDataSchema = new Schema<ICourseData>({
  videoUrl: String,
  videoThumbnail: Object,
  title: String,
  videoSection: String,
  description: String,
  videoLength: Number,
  videoPlayer: String,
  links: [linkSchema],
  suggestion: String,
  questions: [commentSchema],
});

const courseSchema = new Schema<ICourse>({
  name: {
    type: String,
    required: true,
  },
  status: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  categories: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  estimatedPrice: {
    type: Number,
  },
  thumbnail: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  tags: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    required: true,
  },
  demoUrl: {
    type: String,
    required: true,
  },
  benefits: [{ title: String }],
  prerequisites: [{ title: String }],
  limitWatchedTime: {
    type: Number,
    default: 0,
  },
  reviews: [reviewSchema],
  courseData: [courseDataSchema],
  ratings: {
    type: Number,
    default: 0,
  },
  purchased: {
    type: Number,
    default: 0,
  },
  quiz: {
    preTestEnabled: {
      type: Boolean,
      default: false,
    },
    preTestTitle: {
      type: String,
    },
    preTestId: {
      type: mongoose.Types.ObjectId,
      ref: "Quiz",
      required: false,
    },
    postTestEnabled: {
      type: Boolean,
      default: false,
    },
    postTestTitle: {
      type: String,
    },
    postTestId: {
      type: mongoose.Types.ObjectId,
      ref: "Quiz",
      required: false,
    },
  },
  certificate: {
    type: String,
    required: false,
  },
}, { timestamps: true });


const CourseModel: Model<ICourse> = mongoose.model("Course", courseSchema);

export default CourseModel;
