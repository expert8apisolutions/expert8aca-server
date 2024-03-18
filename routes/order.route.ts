import express from "express";
import { authorizeRoles, isAutheticated } from "../middleware/auth";
import {
  createOrderEbookPostback,
  createOrderPostback,
  getAllOrders,
  newPayment,
  sendTokenPayment,
} from "../controllers/order.controller";
const orderRouter = express.Router();

orderRouter.get("/create-order-postback", createOrderPostback);
orderRouter.get("/create-order-ebook-postback", createOrderEbookPostback);

orderRouter.get(
  "/get-orders",
  isAutheticated,
  authorizeRoles("admin"),
  getAllOrders
);

orderRouter.post("/payment/token", isAutheticated, sendTokenPayment);

orderRouter.post("/payment", isAutheticated, newPayment);

export default orderRouter;
