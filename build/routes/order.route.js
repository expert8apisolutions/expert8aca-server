"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const order_controller_1 = require("../controllers/order.controller");
const orderRouter = express_1.default.Router();
orderRouter.get("/create-order-postback", order_controller_1.createOrderPostback);
orderRouter.get("/create-order-ebook-postback", order_controller_1.createOrderEbookPostback);
orderRouter.get("/get-orders", auth_1.isAutheticated, (0, auth_1.authorizeRoles)("admin"), order_controller_1.getAllOrders);
orderRouter.post("/payment/token", auth_1.isAutheticated, order_controller_1.sendTokenPayment);
orderRouter.post("/payment", auth_1.isAutheticated, order_controller_1.newPayment);
exports.default = orderRouter;
