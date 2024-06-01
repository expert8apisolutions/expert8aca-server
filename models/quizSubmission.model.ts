import mongoose, { Schema, Document } from 'mongoose';

interface AnswerList {
  question_id: string;
  answer: string;
}

const AnswerListSchema: Schema = new Schema({
  question_id: { type: String, required: true },
  answer: { type: String, required: true },
});

interface Test {
  score: number;
  isPassed: boolean;
  submit_date: Date;
  answerList: AnswerList[];
}

const TestSchema: Schema = new Schema({
  score: { type: Number, required: true },
  isPassed: { type: Boolean, required: true },
  submit_date: { type: Date, required: true },
  answerList: { type: [AnswerListSchema], required: true },
});

export type IStatus = "NOT_START" | "PENDING" | "COMPLETED";

interface QuizSubmission extends Document {
  user_id: mongoose.Types.ObjectId;
  quiz_id: mongoose.Types.ObjectId;
  pre_test: Test[];
  post_test: Test[];
  pre_test_score?: number;
  post_test_score?: number;
  pre_test_passed?: boolean;
  post_test_passed?: boolean;
  pre_test_status: IStatus;
  post_test_status: IStatus;
  status: IStatus;
}

const QuizSubmissionSchema: Schema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  quiz_id: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true },
  pre_test: { type: [TestSchema], required: true },
  post_test: { type: [TestSchema], required: true },
  pre_test_score: { type: Number, required: true },
  pre_test_passed: { type: Boolean, required: true, default: false },
  pre_test_status: { type: String, default: "NOT_START" },
  post_test_score: { type: Number, required: true },
  post_test_passed: { type: Boolean, required: true, default: false },
  post_test_status: { type: String, default: "NOT_START" },
  status: { type: String },
});

const QuizSubmissionModel = mongoose.model<QuizSubmission>('Quiz_Submission', QuizSubmissionSchema);

export default QuizSubmissionModel;
