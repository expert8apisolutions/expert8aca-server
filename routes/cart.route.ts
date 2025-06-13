import express from "express";
import { isAutheticated } from "../middleware/auth";
import {
  addToCart,
  removeFromCart,
  getUserCart,
  clearCart,
  checkoutCart
} from "../controllers/cart.controller";

const cartRouter = express.Router();

// Cart routes
cartRouter.post("/add", isAutheticated, addToCart);
cartRouter.delete("/remove/:courseId", isAutheticated, removeFromCart);
cartRouter.get("/get-cart", isAutheticated, getUserCart);
cartRouter.delete("/clear", isAutheticated, clearCart);
cartRouter.post("/checkout", isAutheticated, checkoutCart);

export default cartRouter;
