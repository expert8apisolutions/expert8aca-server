"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const cart_controller_1 = require("../controllers/cart.controller");
const cartRouter = express_1.default.Router();
// Cart routes
cartRouter.post("/add", auth_1.isAutheticated, cart_controller_1.addToCart);
cartRouter.delete("/remove/:courseId", auth_1.isAutheticated, cart_controller_1.removeFromCart);
cartRouter.get("/get-cart", auth_1.isAutheticated, cart_controller_1.getUserCart);
cartRouter.delete("/clear", auth_1.isAutheticated, cart_controller_1.clearCart);
cartRouter.post("/checkout", auth_1.isAutheticated, cart_controller_1.checkoutCart);
exports.default = cartRouter;
