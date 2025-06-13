import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import OrderModel, { IAddressInfo, IOrder } from "../models/order.Model";
import userModel from "../models/user.model";
import CourseModel, { ICourse } from "../models/course.model";
import CartModel from "../models/cart.model";
import path from "path";
import ejs from "ejs";
import sendMail from "../utils/sendMail";
import NotificationModel from "../models/notification.Model";
import { getAllOrdersService, newOrder, newOrderEbook } from "../services/order.service";
import { redis } from "../utils/redis";
import ebookModel, { IEbook } from "../models/ebook.model";
import { GbPrimepayService } from "../services/gbPrimepay.service";
import { signTokenPayment, verifyTokenPayment } from "../utils/jwt";
import axios from "axios";
import dayjs from 'dayjs'
import { CheckSlipService } from "../services/checkSlip.service";
import OrderEbookModel from "../models/orderEbook.model";
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const gbPrimepayService = new GbPrimepayService();
const checkSlipApi = new CheckSlipService();


const BASE_URL_PAYMENT_ORDER_DETAIL = 'https://apis.paysolutions.asia/order/orderdetailpost'
const merchantIdLast5Char = process.env?.PAYMENT_MERCHANT_ID?.slice(3, 8)

const defaultBody = { merchantId: merchantIdLast5Char, orderNo: "", productDetail: "" }
const defaultHeader = {
  headers: {
    merchantId: merchantIdLast5Char,
    merchantSecretKey: process.env.PAYMENT_SECRET_KEY,
    'Content-Type': 'application/json',
    apikey: process.env.PAYMENT_API_KEY
  }
}

export const createOrderPostback = CatchAsyncError(async (req: any, res: Response, next: NextFunction) => {
  try {
    const { payment_token } = req.query

    const verifyToken: any = verifyTokenPayment(payment_token as string)
    if (verifyToken) {
      const course: ICourse | null = await CourseModel.findById(verifyToken.courseId);

      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }

      try {
        const response = await axios.post(BASE_URL_PAYMENT_ORDER_DETAIL, {
          ...defaultBody,
          refNo: verifyToken.refId + ''
        },
          defaultHeader)
        if (response.data?.length) {
          const { Total, Status } = response.data[0]
          if (course.price === Total && ['TC', 'CP', 'Y'].includes(Status)) {
            req.user = { _id: verifyToken?.userId }
            req.body = { courseId: verifyToken.courseId, payment_info: response.data[0], isFree: false }
            console.log('create order Course complete', { course, payment: response.data[0], verifyToken })
            return createOrder(req, res, next)
          } else {
            console.log('error, price is not match', { verifyToken, course, payment: response.data[0], coursePrice: course.price, paymentTotal: Total })
            next(new ErrorHandler("price is not match", 400));
          }
        } else {
          return next(new ErrorHandler("response payment not found", 404));
        }

      } catch (err) {
        console.log("🚀 ~ file: order.route.ts:51 ~ orderRouter.get ~ err:", err, verifyToken)
        return next(new ErrorHandler("verify payment error", 400));
      }
    }
    return next(new ErrorHandler("verify token error", 400));
  } catch (err: any) {
    return next(new ErrorHandler("error " + err?.message || 'createOrderPostback', 500));
  }
}
)

export const createOrderEbookPostback = CatchAsyncError(async (req: any, res: Response, next: NextFunction) => {
  try {
    const { payment_token } = req.query

    const verifyToken: any = verifyTokenPayment(payment_token as string)
    if (verifyToken) {
      const ebook: ICourse | null = await ebookModel.findById(verifyToken.ebookId);

      if (!ebook) {
        return next(new ErrorHandler("Ebook not found", 404));
      }

      try {
        const response = await axios.post(BASE_URL_PAYMENT_ORDER_DETAIL, {
          ...defaultBody,
          refNo: verifyToken.refId + ''
        },
          defaultHeader)
        if (response.data?.length) {
          const { Total, Status } = response.data[0]
          if (ebook.price === Total && ['TC', 'CP', 'Y'].includes(Status)) {
            req.user = { _id: verifyToken?.userId }
            req.body = { ebookId: verifyToken.ebookId, payment_info: response.data[0], isFree: false }
            console.log('create order Ebook complete', { ebook, payment: response.data[0], verifyToken })
            return createOrderEbook(req, res, next)
          } else {
            console.log('error, price is not match', { verifyToken, ebook, payment: response.data[0], coursePrice: ebook.price, paymentTotal: Total })
            next(new ErrorHandler("price is not match", 400));
          }
        } else {
          return next(new ErrorHandler("response payment not found", 404));
        }

      } catch (err) {
        console.log("🚀 ~ file: order.route.ts:51 ~ orderRouter.get ~ err:", err, verifyToken)
        return next(new ErrorHandler("verify payment error", 400));
      }
    }
    return next(new ErrorHandler("verify token error", 400));
  } catch (err: any) {
    return next(new ErrorHandler("error " + err?.message || 'createOrderPostback', 500));
  }

})


// create order
export const createOrder = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId, payment_info, isFree } = req.body;
      const userId = req.user?._id

      const user = await userModel.findById(userId);

      const courseExistInUser = user?.courses.some(
        (course: any) => course.courseId?.toString() === courseId);

      if (courseExistInUser) {
        return next(
          new ErrorHandler("You have already purchased this course", 400)
        );
      }

      const course: ICourse | null = await CourseModel.findById(courseId);

      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }

      if (isFree && course.price != 0) {
        return next(new ErrorHandler("Course not Free It price " + course.price, 400));
      }

      const data: any = {
        courseId: course._id,
        userId: user?._id,
        payment_info: isFree ? {} : payment_info,
      };

      const mailData = {
        order: {
          _id: course._id.toString().slice(0, 6),
          name: course.name,
          price: course.price,
          date: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        },
      };

      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/order-confirmation.ejs"),
        { order: mailData }
      );

      try {
        if (user) {
          await sendMail({
            email: user.email,
            subject: "Order Confirmation",
            template: "order-confirmation.ejs",
            data: mailData,
          });
        }
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
      }

      user?.courses.push({
        courseId: course?._id,
        orderDate: new Date(),
        expireDate: dayjs().add(+(process.env.EXPIRE_DATE_DEFAULT_COURSE_IN_DAY as string), 'day').toDate(),
      });


      await redis.set(req.user?._id, JSON.stringify(user));

      await user?.save();

      await NotificationModel.create({
        user: user?._id,
        title: "New Order",
        message: `You have a new order from ${course?.name}`,
      });

      course.purchased = course.purchased + 1;

      await course.save();

      newOrder(data, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// create order Ebook
export const createOrderEbook = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { ebookId, payment_info, isFree } = req.body as any;

      const user = await userModel.findById(req.user?._id);

      const courseExistInUser = user?.ebooks.some(
        (ebook: any) => ebook._id.toString() === ebookId
      );

      if (courseExistInUser) {
        return next(
          new ErrorHandler("You have already purchased this ebook", 400)
        );
      }

      const ebook: IEbook | null = await ebookModel.findById(ebookId);

      if (!ebook) {
        return next(new ErrorHandler("ebook not found", 404));
      }

      if (isFree && ebook.price != 0) {
        return next(new ErrorHandler("Ebook not Free It price " + ebook.price, 400));
      }

      const data: any = {
        ebookId: ebook._id,
        userId: user?._id,
        payment_info: isFree ? {} : payment_info,
      };

      const mailData = {
        order: {
          _id: ebook._id.toString().slice(0, 6),
          name: ebook.name,
          price: ebook.price,
          date: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        },
      };

      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/order-confirmation.ejs"),
        { order: mailData }
      );

      try {
        if (user) {
          await sendMail({
            email: user.email,
            subject: "Order Confirmation",
            template: "order-confirmation.ejs",
            data: mailData,
          });
        }
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
      }

      user?.ebooks.push(ebook?._id);

      await redis.set(req.user?._id, JSON.stringify(user));

      await user?.save();

      await NotificationModel.create({
        user: user?._id,
        title: "New Order",
        message: `You have a new order from ${ebook?.name}`,
      });

      ebook.purchased = ebook.purchased + 1;

      await ebook.save();

      newOrderEbook(data, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// get All orders --- only for admin
export const getAllOrders = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllOrdersService(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//  send stripe publishble key
export const sendStripePublishableKey = CatchAsyncError(
  async (req: Request, res: Response) => {
    res.status(200).json({
      publishablekey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
  }
);


export const checkPayment = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refId } = req.query as { refId: string };
      const userId = req.user?._id

      if (!refId) {
        return next(new ErrorHandler('refId is required', 500));
      }

      const { txn: paymentInfo } = await gbPrimepayService.getTransaction(refId)
      if (paymentInfo?.status !== PaymentStatus.Settle) {
        return next(new ErrorHandler('payment not Settle', 500));
      }
      const { merchantDefined1: userIdAsPayment, merchantDefined2: paymentCourseId, merchantDefined3: productType, } = paymentInfo

      if (userIdAsPayment !== userId) {
        return next(new ErrorHandler('userId not match', 500));
      }

      const foundOrder = await OrderModel.findOne({ referenceNo: refId })
      if (!foundOrder) {
        return next(new ErrorHandler('refId not found', 500));
      }

      if (foundOrder?.courseId !== paymentCourseId) {
        return next(new ErrorHandler('courseId not match', 500));
      }

      return res.status(200).json({
        success: true,
        referenceNo: refId,
        courseId: paymentCourseId
      });

    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);


// new payment
export const newPayment = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {

      const { courseId } = req.body;
      const userId = req.user?._id

      const myPayment = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: "thb",
        metadata: {
          company: "E-Learning",
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      res.status(201).json({
        success: true,
        client_secret: myPayment.client_secret,
      });
    } catch (error: any) {
      console.log("🚀 ~ file: order.controller.ts:155 ~ error:", error)
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

enum ProductType {
  COURSE = "course",
  EBOOK = "ebook",
  CART = "cart"
}

enum PaymentStatus {
  Settle = "S",
}

export const getPaymentCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {

      const { courseId } = req.body
      const userId = req.user?._id

      if (!courseId) {
        return next(new ErrorHandler("courseId is required", 404));
      }

      const user = await userModel.findById(userId)
      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      const course: ICourse | null = await CourseModel.findById(courseId);
      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }

      const courseExistInUser = user?.courses.some(
        (course: any) => course.courseId?.toString() === courseId);
      if (courseExistInUser) {
        return next(
          new ErrorHandler("You have already purchased this course", 400)
        );
      }

      const paymentDetail = await gbPrimepayService.createPaymentLink({
        amount: course.price,
        detail: course.name,
        customerName: user.name,
        customerEmail: user.email ?? '',
        userId,
        courseId,
        productType: ProductType.COURSE,
      })
      console.log("🚀 ~ paymentDetail:", paymentDetail)

      res.status(201).json({
        success: true,
        paymentUrl: paymentDetail.redirectUrl,
        paymentDetail,
      });
    } catch (error: any) {
      console.log("🚀 ~ file: order.controller.ts:155 ~ error:", error)
      return next(new ErrorHandler(error.message, 500));
    }
  }
);


interface ICreateOrderCourse {
  courseId: string;
  userId: string;
  referenceNo: string;
  paymentInfo: any;
  addressInfo?: IAddressInfo;
}
const createOrderCourse = async ({
  courseId,
  userId,
  referenceNo,
  paymentInfo,
  addressInfo,
}: ICreateOrderCourse) => {

  const user = await userModel.findById(userId);
  const course: ICourse | null = await CourseModel.findById(courseId);

  if (!course) {
    throw new Error("Course not found");
  }

  const mailData = {
    order: {
      _id: referenceNo,
      name: course?.name,
      price: course?.price,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    },
  };

  try {
    if (user) {
      sendMail({
        email: user.email,
        subject: "Order Confirmation",
        template: "order-confirmation.ejs",
        data: mailData,
      })
    }
  } catch (error: any) {
    throw new Error(error.message);
  }

  user?.courses.push({
    courseId: course?._id,
    orderDate: new Date(),
    expireDate: dayjs().add(+(process.env.EXPIRE_DATE_DEFAULT_COURSE_IN_DAY as string), 'day').toDate(),
  });

  redis.set(userId, JSON.stringify(user));

  NotificationModel.create({
    user: user?._id,
    title: "New Order",
    message: `You have a new order from ${course?.name}`,
  });

  course.purchased = course.purchased + 1;

  course.save();
  user?.save();

  const data: any = {
    courseId: course?._id,
    userId: user?._id,
    referenceNo: referenceNo,
    payment_info: paymentInfo,
    addressInfo,
  };

  const result = await OrderModel.create(data)
  return result
}


export const sendTokenPayment = CatchAsyncError(
  async (req: Request, res: Response) => {
    const user = req.user;
    const refId = (Math.floor(Date.now() / 10)) + ''
    return res.status(200).json({
      token: signTokenPayment({
        userId: user?._id,
        courseId: req.body?.courseId,
        ebookId: req.body?.ebookId,
        refId
      }),
      refId,
    });
  }
);


export const webhookOrder = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { referenceNo } = req.body

      const order = await OrderModel.findOne({ referenceNo })
      if (order) {
        return next(new ErrorHandler('Order Duplicate', 500));
      }

      const { txn: paymentInfo } = await gbPrimepayService.getTransaction(referenceNo)
      if (paymentInfo?.status !== PaymentStatus.Settle) {
        return next(new ErrorHandler('payment not Settle', 500));
      }

      const { merchantDefined1: userId, merchantDefined2: courseId, merchantDefined3: productType, } = paymentInfo

      if (productType === ProductType.COURSE) {
        const result = await createOrderCourse({ courseId, userId, referenceNo, paymentInfo })
        res.status(200).json({
          success: true,
          result,
        });
      } else if (productType === ProductType.EBOOK) {
        res.status(200).json({
          success: true,
        });
      }
      else {
        return next(new ErrorHandler('productType not found', 500));
      }
    } catch (error: any) {
      console.log("🚀 ~ file: order.controller.ts:155 ~ error:", error)
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

interface ICreateOrderEbookSlip {
  ebookId: string;
  userId: string;
  referenceNo: string;
  paymentInfo: any;
}

const createOrderEbookSlip = async ({
  ebookId,
  userId,
  referenceNo,
  paymentInfo,
}: ICreateOrderEbookSlip) => {
  try {

    const user = await userModel.findById(userId);
    const ebook: IEbook | null = await ebookModel.findById(ebookId);

    if (!ebook) {
      throw new Error("Ebook not found");
    }

    const mailData = {
      order: {
        _id: referenceNo,
        name: ebook?.name,
        price: ebook?.price,
        date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      },
    };

    try {
      if (user) {
        await sendMail({
          email: user.email,
          subject: "Order Confirmation",
          template: "order-confirmation.ejs",
          data: mailData,
        });
      }
    } catch (error: any) {
      console.log("🚀 ~ createOrderEbookSlip error:", error)
    }

    user?.ebooks.push(ebook?._id);

    await redis.set(userId, JSON.stringify(user));

    await user?.save();

    NotificationModel.create({
      user: user?._id,
      title: "New Order",
      message: `You have a new order from ${ebook?.name}`,
    });

    ebook.purchased = ebook.purchased + 1;

    await ebook.save();

    const data: any = {
      ebookId,
      userId,
      payment_info: paymentInfo ?? {},
      referenceNo,
    };

    const resultOrder = await OrderEbookModel.create(data)
    return {
      ebookId: resultOrder.ebookId,
      referenceNo: resultOrder.referenceNo,
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
}

const checkName = (displayName: string) => {
  return displayName?.includes(process.env.BANK_ACCOUNT_NAME_EN + '') || displayName?.includes(process.env.BANK_ACCOUNT_NAME_TH + '')
}

const getBankNoNumber = (bankNoPattern: string) => {
  if (!bankNoPattern) return 'not-match-bank-no'
  return bankNoPattern?.replace?.(/\D/g, '')

}

const checkBankNo = (receiver: any) => {
  const isBankAccount = process.env.BANK_ACCOUNT_NO?.includes(getBankNoNumber(receiver?.account?.value || ''))
  const isBankProxy = process.env.BANK_ACCOUNT_NO?.includes(getBankNoNumber(receiver?.proxy?.value || ''))
  return isBankAccount || isBankProxy
}

const checkDuplicateOrder = async (transRef: string, productType: string) => {
  if (productType === ProductType.COURSE || productType === ProductType.CART) {
    const order = await OrderModel.findOne({ referenceNo: transRef })
    return order ? 'สลิปนี้ถูกใช้แล้ว' : false
  }
  else if (productType === ProductType.EBOOK) {
    const order = await OrderEbookModel.findOne({ referenceNo: transRef })
    return order ? 'สลิปนี้ถูกใช้แล้ว' : false
  }
  return false
}

const checkSlip = async (qrData: any, product: ICourse | IEbook, productType: string) => {
  const dataSlip = await checkSlipApi.inquiry(qrData)
  if (dataSlip) {
    console.debug('checkSlip result: =>', {
      receiver: dataSlip?.data?.receiver,
      data: dataSlip?.data,
    })
    const isChecked = await checkDuplicateOrder(dataSlip?.data?.transRef, productType)
    if (isChecked) {
      throw new Error(isChecked)
    }
    const isCorrectName = checkName(dataSlip?.data?.receiver?.displayName)
    const isCorrectBackNo = checkBankNo(dataSlip?.data?.receiver)
    const isCorrectAmount = dataSlip?.data?.amount == product?.price

    if (!isCorrectBackNo) {
      throw new Error('เลขบัญชีไม่ถูกต้อง')
    }

    if (!isCorrectName) {
      throw new Error('ชื่อผู้รับเงินไม่ถูกต้อง')
    }

    if (!isCorrectAmount) {
      throw new Error(`จำนวนเงินไม่ถูกต้อง`)
    }
    return dataSlip
  } else {
    throw new Error('ไม่พสลิป')
  }
}

export const verifySlip = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { productType, productId, qrData, addressInfo } = req.body
      const userId = req.user?._id

      if (!productType || !productId || !qrData) {
        return next(new ErrorHandler('productType, productId, qrData is required', 500));
      }

      if (productType === ProductType.CART) {
        // Get the user
        const user = await userModel.findById(userId);
        if (!user) {
          return next(new ErrorHandler('User not found', 404));
        }

        // Get all cart items
        const cartItems = await CartModel.find({ userId });
        
        if (!cartItems || cartItems.length === 0) {
          return next(new ErrorHandler('Your cart is empty', 400));
        }

        // Get course details for each cart item
        const courseIds = cartItems.map((item: any) => item.courseId);
        const courses = await CourseModel.find({ _id: { $in: courseIds } });

        // Calculate total price
        const totalPrice = courses.reduce((sum, course) => sum + course.price, 0);

        // Check if the slip payment matches the total price
        const resultSlip = await checkSlip(qrData, { 
          price: totalPrice, 
          name: 'Cart Checkout',
          description: 'Multiple courses checkout',
          thumbnail: { url: '', public_id: '' }
        } as ICourse, ProductType.CART);

        // Create orders for each course
        const orderResults = [];
        for (const course of courses) {
          // Check if user already has this course
          const courseExistInUser = user.courses.some(
            (userCourse: any) => userCourse.courseId?.toString() === course._id.toString()
          );

          if (!courseExistInUser) {
            // Add course to user
            user.courses.push({
              courseId: course._id,
              orderDate: new Date(),
              expireDate: dayjs().add(+(process.env.EXPIRE_DATE_DEFAULT_COURSE_IN_DAY as string), 'day').toDate(),
            });

            // Create order record
            const orderResult = await createOrderCourse({
              courseId: course._id.toString(),
              userId,
              referenceNo: resultSlip.data.transRef,
              paymentInfo: resultSlip,
              addressInfo
            });

            orderResults.push(orderResult);

            // Update course purchase count
            course.purchased = course.purchased + 1;
            await course.save();

            // Create notification
            await NotificationModel.create({
              user: userId,
              title: "New Order",
              message: `You have a new order from ${course.name}`,
            });
          }
        }

        // Save user changes
        await user.save();
        await redis.set(userId, JSON.stringify(user));

        // Clear the cart after successful checkout
        await CartModel.deleteMany({ userId });

        res.status(200).json({
          success: true,
          result: {
            coursesPurchased: orderResults.length,
            totalPrice
          },
        });
      } else if (productType === ProductType.COURSE) {
        const [product, user] = await Promise.all([
          CourseModel.findById(productId),
          userModel.findById(userId)
        ])
        if (!product) {
          return next(new ErrorHandler('Course not found', 500));
        }

        const courseExistInUser = user?.courses.some(
          (course: any) => course._id.toString() === productId
        );

        if (courseExistInUser) {
          return next(
            new ErrorHandler("You have already purchased this course", 400)
          );
        }

        const resultSlip = await checkSlip(qrData, product, ProductType.COURSE)
        const result = await createOrderCourse({ courseId: productId, userId, referenceNo: resultSlip.data.transRef, paymentInfo: resultSlip, addressInfo })
        res.status(200).json({
          success: true,
          result,
        });
      }
      else if (productType === ProductType.EBOOK) {
        const [product, user] = await Promise.all([
          ebookModel.findById(productId),
          userModel.findById(userId)
        ])

        if (!product) {
          return next(new ErrorHandler('Ebook not found', 500));
        }

        const ebookExistInUser = user?.ebooks.some(
          (ebook: any) => ebook._id.toString() === productId
        );

        if (ebookExistInUser) {
          return next(
            new ErrorHandler("You have already purchased this ebook", 400)
          );
        }

        const resultSlip = await checkSlip(qrData, product, ProductType.EBOOK)
        const result = await createOrderEbookSlip({ ebookId: productId, userId, referenceNo: resultSlip.data.transRef, paymentInfo: resultSlip })
        console.log("🚀 ~ result:", result)
        res.status(200).json({
          success: true,
          result,
        });
      } else {
        return next(new ErrorHandler('productType not found', 500));
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);