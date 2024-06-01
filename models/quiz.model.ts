import mongoose, { Schema, Document } from 'mongoose';

interface Choice {
    choice: string;
    description: string;
    type: string;
    image_link: string;
    answer: string;
}

interface QuizItem {
    question: string;
    description: string;
    answer: string;
    image_link: string;
    choices: Choice[];
}

export interface IQuiz extends Document {
    name: string;
    description: string;
    pass_percentage: number;
    max_submission_pre_test: number;
    max_submission_post_test: number;
    time_limit_minutes: number | null;
    quizItem: QuizItem[];
}

const ChoiceSchema: Schema = new Schema({
    choice: { type: String, required: true },
    answer: { type: String, required: true },
    description: { type: String, required: false },
    type: { type: String, required: true },
    image_link: { type: String, required: false },
});

const QuizItemSchema: Schema = new Schema({
    question: { type: String, required: true },
    description: { type: String, required: false },
    answer: { type: String, required: true },
    image_link: { type: String, required: false },
    choices: { type: [ChoiceSchema], required: true },
});

const QuizSchema: Schema = new Schema<IQuiz>({
    name: { type: String, required: true },
    description: { type: String, required: false },
    pass_percentage: { type: Number, required: true },
    max_submission_pre_test: { type: Number, required: true },
    max_submission_post_test: { type: Number, required: true },
    time_limit_minutes: { type: Number, required: false },
    quizItem: { type: [QuizItemSchema], required: true },
    
},{
    timestamps: true,
});

const QuizModel = mongoose.model<IQuiz>('Quiz', QuizSchema);

export default QuizModel;
