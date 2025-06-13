import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import CartModel from "../models/cart.model";
import CourseModel from "../models/course.model";
import { redis } from "../utils/redis";

// Add item to cart
export const addToCart = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId } = req.body;
      const userId = req.user?._id;

      if (!courseId) {
        return next(new ErrorHandler("Course ID is required", 400));
      }

      // Check if course exists
      const course = await CourseModel.findById(courseId);
      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }

      // Check if item already in cart
      const existingCartItem = await CartModel.findOne({
        courseId,
        userId,
      });

      if (existingCartItem) {
        return next(
          new ErrorHandler("Course is already in your cart", 400)
        );
      }

      // Add to cart
      const cartItem = await CartModel.create({
        courseId,
        userId,
      });

      res.status(200).json({
        success: true,
        cartItem,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Remove item from cart
export const removeFromCart = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId } = req.params;
      const userId = req.user?._id;

      const cartItem = await CartModel.findOneAndDelete({
        courseId,
        userId,
      });

      if (!cartItem) {
        return next(new ErrorHandler("Item not found in cart", 404));
      }

      res.status(200).json({
        success: true,
        message: "Item removed from cart",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Get user cart
export const getUserCart = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id;

      const cartItems = await CartModel.find({ userId });
      
      if (!cartItems) {
        return res.status(200).json({
          success: true,
          cart: [],
        });
      }

      // Get course details for each cart item
      const courseIds = cartItems.map(item => item.courseId);
      const courses = await CourseModel.find({ _id: { $in: courseIds } });

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
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Clear cart
export const clearCart = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id;

      await CartModel.deleteMany({ userId });

      res.status(200).json({
        success: true,
        message: "Cart cleared successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Checkout cart - purchase all courses in cart
export const checkoutCart = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id;
      const { payment_info } = req.body;

      // Get all cart items
      const cartItems = await CartModel.find({ userId });
      
      if (!cartItems || cartItems.length === 0) {
        return next(new ErrorHandler("Your cart is empty", 400));
      }

      // Get course details for each cart item
      const courseIds = cartItems.map(item => item.courseId);
      const courses = await CourseModel.find({ _id: { $in: courseIds } });

      // Calculate total price
      const totalPrice = courses.reduce((sum, course) => sum + course.price, 0);

      // Handle payment based on payment method
      if (payment_info.type === "slip" || payment_info.type === "visa") {
        // For slip or visa payment, we'll handle it in the verifySlip endpoint
        // Return cart information for the frontend to process
        return res.status(200).json({
          success: true,
          cartInfo: {
            totalPrice,
            coursesPurchased: courses.length,
            courses: courses.map(course => ({
              id: course._id,
              name: course.name,
              price: course.price,
              thumbnail: course.thumbnail
            }))
          }
        });
      } else if (payment_info.type === "card") {
        // For card payment (Stripe), implement Stripe payment logic here
        // This would be similar to your existing Stripe payment implementation
        // but adapted for multiple courses
        
        // For now, we'll return an error as this is not yet implemented
        return next(new ErrorHandler("Card payment for cart checkout is not yet implemented", 501));
      } else {
        return next(new ErrorHandler("Invalid payment method", 400));
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
