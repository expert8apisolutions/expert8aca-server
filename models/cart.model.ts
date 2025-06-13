import mongoose, { Document, Model, Schema } from "mongoose";

export interface ICartItem extends Document {
  courseId: string;
  userId: string;
  addedAt: Date;
}

const cartItemSchema = new Schema<ICartItem>(
  {
    courseId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const CartModel: Model<ICartItem> = mongoose.model("Cart", cartItemSchema);

export default CartModel;
