"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkoutCart = exports.clearCart = exports.getUserCart = exports.removeFromCart = exports.addToCart = void 0;
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const cart_model_1 = __importDefault(require("../models/cart.model"));
const course_model_1 = __importDefault(require("../models/course.model"));
// Add item to cart
exports.addToCart = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { courseId } = req.body;
        const userId = req.user?._id;
        if (!courseId) {
            return next(new ErrorHandler_1.default("Course ID is required", 400));
        }
        // Check if course exists
        const course = await course_model_1.default.findById(courseId);
        if (!course) {
            return next(new ErrorHandler_1.default("Course not found", 404));
        }
        // Check if item already in cart
        const existingCartItem = await cart_model_1.default.findOne({
            courseId,
            userId,
        });
        if (existingCartItem) {
            return next(new ErrorHandler_1.default("Course is already in your cart", 400));
        }
        // Add to cart
        const cartItem = await cart_model_1.default.create({
            courseId,
            userId,
        });
        res.status(200).json({
            success: true,
            cartItem,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// Remove item from cart
exports.removeFromCart = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { courseId } = req.params;
        const userId = req.user?._id;
        const cartItem = await cart_model_1.default.findOneAndDelete({
            courseId,
            userId,
        });
        if (!cartItem) {
            return next(new ErrorHandler_1.default("Item not found in cart", 404));
        }
        res.status(200).json({
            success: true,
            message: "Item removed from cart",
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// Get user cart
exports.getUserCart = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const cartItems = await cart_model_1.default.find({ userId });
        if (!cartItems) {
            return res.status(200).json({
                success: true,
                cart: [],
            });
        }
        // Get course details for each cart item
        const courseIds = cartItems.map(item => item.courseId);
        const courses = await course_model_1.default.find({ _id: { $in: courseIds } });
        // Combine cart items with course details
        const cart = cartItems.map(item => {
            const course = courses.find(c => c._id.toString() === item.courseId);
            return {
                cartItemId: item._id,
                courseId: item.courseId,
                addedAt: item.addedAt,
                course: {
                    name: course?.name,
                    description: course?.description,
                    price: course?.price,
                    thumbnail: course?.thumbnail,
                }
            };
        });
        res.status(200).json({
            success: true,
            cart,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// Clear cart
exports.clearCart = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const userId = req.user?._id;
        await cart_model_1.default.deleteMany({ userId });
        res.status(200).json({
            success: true,
            message: "Cart cleared successfully",
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// Checkout cart - purchase all courses in cart
exports.checkoutCart = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const { payment_info } = req.body;
        // Get all cart items
        const cartItems = await cart_model_1.default.find({ userId });
        if (!cartItems || cartItems.length === 0) {
            return next(new ErrorHandler_1.default("Your cart is empty", 400));
        }
        // Get course details for each cart item
        const courseIds = cartItems.map(item => item.courseId);
        const courses = await course_model_1.default.find({ _id: { $in: courseIds } });
        // Calculate total price
        const totalPrice = courses.reduce((sum, course) => sum + course.price, 0);
        // Create orders for each course
        // This is a placeholder - you would need to implement the actual order creation logic
        // similar to your existing createOrder function but adapted for multiple courses
        // Clear the cart after successful checkout
        await cart_model_1.default.deleteMany({ userId });
        res.status(200).json({
            success: true,
            message: "Checkout successful",
            totalPrice,
            coursesPurchased: courses.length,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
