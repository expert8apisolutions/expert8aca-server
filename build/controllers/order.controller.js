"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySlip = exports.webhookOrder = exports.sendTokenPayment = exports.getPaymentCourse = exports.newPayment = exports.checkPayment = exports.sendStripePublishableKey = exports.getAllOrders = exports.createOrderEbook = exports.createOrder = exports.createOrderEbookPostback = exports.createOrderPostback = void 0;
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const order_Model_1 = __importDefault(require("../models/order.Model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const course_model_1 = __importDefault(require("../models/course.model"));
const path_1 = __importDefault(require("path"));
const ejs_1 = __importDefault(require("ejs"));
const sendMail_1 = __importDefault(require("../utils/sendMail"));
const notification_Model_1 = __importDefault(require("../models/notification.Model"));
const order_service_1 = require("../services/order.service");
const redis_1 = require("../utils/redis");
const ebook_model_1 = __importDefault(require("../models/ebook.model"));
const gbPrimepay_service_1 = require("../services/gbPrimepay.service");
const jwt_1 = require("../utils/jwt");
const axios_1 = __importDefault(require("axios"));
const dayjs_1 = __importDefault(require("dayjs"));
const checkSlip_service_1 = require("../services/checkSlip.service");
const orderEbook_model_1 = __importDefault(require("../models/orderEbook.model"));
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const gbPrimepayService = new gbPrimepay_service_1.GbPrimepayService();
const checkSlipApi = new checkSlip_service_1.CheckSlipService();
const BASE_URL_PAYMENT_ORDER_DETAIL = 'https://apis.paysolutions.asia/order/orderdetailpost';
const merchantIdLast5Char = process.env?.PAYMENT_MERCHANT_ID?.slice(3, 8);
const defaultBody = { merchantId: merchantIdLast5Char, orderNo: "", productDetail: "" };
const defaultHeader = {
    headers: {
        merchantId: merchantIdLast5Char,
        merchantSecretKey: process.env.PAYMENT_SECRET_KEY,
        'Content-Type': 'application/json',
        apikey: process.env.PAYMENT_API_KEY
    }
};
exports.createOrderPostback = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { payment_token } = req.query;
        const verifyToken = (0, jwt_1.verifyTokenPayment)(payment_token);
        if (verifyToken) {
            const course = await course_model_1.default.findById(verifyToken.courseId);
            if (!course) {
                return next(new ErrorHandler_1.default("Course not found", 404));
            }
            try {
                const response = await axios_1.default.post(BASE_URL_PAYMENT_ORDER_DETAIL, {
                    ...defaultBody,
                    refNo: verifyToken.refId + ''
                }, defaultHeader);
                if (response.data?.length) {
                    const { Total, Status } = response.data[0];
                    if (course.price === Total && ['TC', 'CP', 'Y'].includes(Status)) {
                        req.user = { _id: verifyToken?.userId };
                        req.body = { courseId: verifyToken.courseId, payment_info: response.data[0], isFree: false };
                        console.log('create order Course complete', { course, payment: response.data[0], verifyToken });
                        return (0, exports.createOrder)(req, res, next);
                    }
                    else {
                        console.log('error, price is not match', { verifyToken, course, payment: response.data[0], coursePrice: course.price, paymentTotal: Total });
                        next(new ErrorHandler_1.default("price is not match", 400));
                    }
                }
                else {
                    return next(new ErrorHandler_1.default("response payment not found", 404));
                }
            }
            catch (err) {
                console.log("🚀 ~ file: order.route.ts:51 ~ orderRouter.get ~ err:", err, verifyToken);
                return next(new ErrorHandler_1.default("verify payment error", 400));
            }
        }
        return next(new ErrorHandler_1.default("verify token error", 400));
    }
    catch (err) {
        return next(new ErrorHandler_1.default("error " + err?.message || 'createOrderPostback', 500));
    }
});
exports.createOrderEbookPostback = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { payment_token } = req.query;
        const verifyToken = (0, jwt_1.verifyTokenPayment)(payment_token);
        if (verifyToken) {
            const ebook = await ebook_model_1.default.findById(verifyToken.ebookId);
            if (!ebook) {
                return next(new ErrorHandler_1.default("Ebook not found", 404));
            }
            try {
                const response = await axios_1.default.post(BASE_URL_PAYMENT_ORDER_DETAIL, {
                    ...defaultBody,
                    refNo: verifyToken.refId + ''
                }, defaultHeader);
                if (response.data?.length) {
                    const { Total, Status } = response.data[0];
                    if (ebook.price === Total && ['TC', 'CP', 'Y'].includes(Status)) {
                        req.user = { _id: verifyToken?.userId };
                        req.body = { ebookId: verifyToken.ebookId, payment_info: response.data[0], isFree: false };
                        console.log('create order Ebook complete', { ebook, payment: response.data[0], verifyToken });
                        return (0, exports.createOrderEbook)(req, res, next);
                    }
                    else {
                        console.log('error, price is not match', { verifyToken, ebook, payment: response.data[0], coursePrice: ebook.price, paymentTotal: Total });
                        next(new ErrorHandler_1.default("price is not match", 400));
                    }
                }
                else {
                    return next(new ErrorHandler_1.default("response payment not found", 404));
                }
            }
            catch (err) {
                console.log("🚀 ~ file: order.route.ts:51 ~ orderRouter.get ~ err:", err, verifyToken);
                return next(new ErrorHandler_1.default("verify payment error", 400));
            }
        }
        return next(new ErrorHandler_1.default("verify token error", 400));
    }
    catch (err) {
        return next(new ErrorHandler_1.default("error " + err?.message || 'createOrderPostback', 500));
    }
});
// create order
exports.createOrder = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { courseId, payment_info, isFree } = req.body;
        const userId = req.user?._id;
        const user = await user_model_1.default.findById(userId);
        const courseExistInUser = user?.courses.some((course) => course.courseId?.toString() === courseId);
        if (courseExistInUser) {
            return next(new ErrorHandler_1.default("You have already purchased this course", 400));
        }
        const course = await course_model_1.default.findById(courseId);
        if (!course) {
            return next(new ErrorHandler_1.default("Course not found", 404));
        }
        if (isFree && course.price != 0) {
            return next(new ErrorHandler_1.default("Course not Free It price " + course.price, 400));
        }
        const data = {
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
        const html = await ejs_1.default.renderFile(path_1.default.join(__dirname, "../mails/order-confirmation.ejs"), { order: mailData });
        try {
            if (user) {
                await (0, sendMail_1.default)({
                    email: user.email,
                    subject: "Order Confirmation",
                    template: "order-confirmation.ejs",
                    data: mailData,
                });
            }
        }
        catch (error) {
            return next(new ErrorHandler_1.default(error.message, 500));
        }
        user?.courses.push({
            courseId: course?._id,
            orderDate: new Date(),
            expireDate: (0, dayjs_1.default)().add(+process.env.EXPIRE_DATE_DEFAULT_COURSE_IN_DAY, 'day').toDate(),
        });
        await redis_1.redis.set(req.user?._id, JSON.stringify(user));
        await user?.save();
        await notification_Model_1.default.create({
            user: user?._id,
            title: "New Order",
            message: `You have a new order from ${course?.name}`,
        });
        course.purchased = course.purchased + 1;
        await course.save();
        (0, order_service_1.newOrder)(data, res, next);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// create order Ebook
exports.createOrderEbook = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { ebookId, payment_info, isFree } = req.body;
        const user = await user_model_1.default.findById(req.user?._id);
        const courseExistInUser = user?.ebooks.some((ebook) => ebook._id.toString() === ebookId);
        if (courseExistInUser) {
            return next(new ErrorHandler_1.default("You have already purchased this ebook", 400));
        }
        const ebook = await ebook_model_1.default.findById(ebookId);
        if (!ebook) {
            return next(new ErrorHandler_1.default("ebook not found", 404));
        }
        if (isFree && ebook.price != 0) {
            return next(new ErrorHandler_1.default("Ebook not Free It price " + ebook.price, 400));
        }
        const data = {
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
        const html = await ejs_1.default.renderFile(path_1.default.join(__dirname, "../mails/order-confirmation.ejs"), { order: mailData });
        try {
            if (user) {
                await (0, sendMail_1.default)({
                    email: user.email,
                    subject: "Order Confirmation",
                    template: "order-confirmation.ejs",
                    data: mailData,
                });
            }
        }
        catch (error) {
            return next(new ErrorHandler_1.default(error.message, 500));
        }
        user?.ebooks.push(ebook?._id);
        await redis_1.redis.set(req.user?._id, JSON.stringify(user));
        await user?.save();
        await notification_Model_1.default.create({
            user: user?._id,
            title: "New Order",
            message: `You have a new order from ${ebook?.name}`,
        });
        ebook.purchased = ebook.purchased + 1;
        await ebook.save();
        (0, order_service_1.newOrderEbook)(data, res, next);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// get All orders --- only for admin
exports.getAllOrders = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        (0, order_service_1.getAllOrdersService)(res);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
//  send stripe publishble key
exports.sendStripePublishableKey = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res) => {
    res.status(200).json({
        publishablekey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
});
exports.checkPayment = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { refId } = req.query;
        const userId = req.user?._id;
        if (!refId) {
            return next(new ErrorHandler_1.default('refId is required', 500));
        }
        const { txn: paymentInfo } = await gbPrimepayService.getTransaction(refId);
        if (paymentInfo?.status !== PaymentStatus.Settle) {
            return next(new ErrorHandler_1.default('payment not Settle', 500));
        }
        const { merchantDefined1: userIdAsPayment, merchantDefined2: paymentCourseId, merchantDefined3: productType, } = paymentInfo;
        if (userIdAsPayment !== userId) {
            return next(new ErrorHandler_1.default('userId not match', 500));
        }
        const foundOrder = await order_Model_1.default.findOne({ referenceNo: refId });
        if (!foundOrder) {
            return next(new ErrorHandler_1.default('refId not found', 500));
        }
        if (foundOrder?.courseId !== paymentCourseId) {
            return next(new ErrorHandler_1.default('courseId not match', 500));
        }
        return res.status(200).json({
            success: true,
            referenceNo: refId,
            courseId: paymentCourseId
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
// new payment
exports.newPayment = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { courseId } = req.body;
        const userId = req.user?._id;
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
    }
    catch (error) {
        console.log("🚀 ~ file: order.controller.ts:155 ~ error:", error);
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
var ProductType;
(function (ProductType) {
    ProductType["COURSE"] = "course";
    ProductType["EBOOK"] = "ebook";
})(ProductType || (ProductType = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["Settle"] = "S";
})(PaymentStatus || (PaymentStatus = {}));
exports.getPaymentCourse = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { courseId } = req.body;
        const userId = req.user?._id;
        if (!courseId) {
            return next(new ErrorHandler_1.default("courseId is required", 404));
        }
        const user = await user_model_1.default.findById(userId);
        if (!user) {
            return next(new ErrorHandler_1.default("User not found", 404));
        }
        const course = await course_model_1.default.findById(courseId);
        if (!course) {
            return next(new ErrorHandler_1.default("Course not found", 404));
        }
        const courseExistInUser = user?.courses.some((course) => course.courseId?.toString() === courseId);
        if (courseExistInUser) {
            return next(new ErrorHandler_1.default("You have already purchased this course", 400));
        }
        const paymentDetail = await gbPrimepayService.createPaymentLink({
            amount: course.price,
            detail: course.name,
            customerName: user.name,
            customerEmail: user.email ?? '',
            userId,
            courseId,
            productType: ProductType.COURSE,
        });
        console.log("🚀 ~ paymentDetail:", paymentDetail);
        res.status(201).json({
            success: true,
            paymentUrl: paymentDetail.redirectUrl,
            paymentDetail,
        });
    }
    catch (error) {
        console.log("🚀 ~ file: order.controller.ts:155 ~ error:", error);
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
const createOrderCourse = async ({ courseId, userId, referenceNo, paymentInfo, addressInfo, }) => {
    const user = await user_model_1.default.findById(userId);
    const course = await course_model_1.default.findById(courseId);
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
            (0, sendMail_1.default)({
                email: user.email,
                subject: "Order Confirmation",
                template: "order-confirmation.ejs",
                data: mailData,
            });
        }
    }
    catch (error) {
        throw new Error(error.message);
    }
    user?.courses.push({
        courseId: course?._id,
        orderDate: new Date(),
        expireDate: (0, dayjs_1.default)().add(+process.env.EXPIRE_DATE_DEFAULT_COURSE_IN_DAY, 'day').toDate(),
    });
    redis_1.redis.set(userId, JSON.stringify(user));
    notification_Model_1.default.create({
        user: user?._id,
        title: "New Order",
        message: `You have a new order from ${course?.name}`,
    });
    course.purchased = course.purchased + 1;
    course.save();
    user?.save();
    const data = {
        courseId: course?._id,
        userId: user?._id,
        referenceNo: referenceNo,
        payment_info: paymentInfo,
        addressInfo,
    };
    const result = await order_Model_1.default.create(data);
    return result;
};
exports.sendTokenPayment = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res) => {
    const user = req.user;
    const refId = (Math.floor(Date.now() / 10)) + '';
    return res.status(200).json({
        token: (0, jwt_1.signTokenPayment)({
            userId: user?._id,
            courseId: req.body?.courseId,
            ebookId: req.body?.ebookId,
            refId
        }),
        refId,
    });
});
exports.webhookOrder = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { referenceNo } = req.body;
        const order = await order_Model_1.default.findOne({ referenceNo });
        if (order) {
            return next(new ErrorHandler_1.default('Order Duplicate', 500));
        }
        const { txn: paymentInfo } = await gbPrimepayService.getTransaction(referenceNo);
        if (paymentInfo?.status !== PaymentStatus.Settle) {
            return next(new ErrorHandler_1.default('payment not Settle', 500));
        }
        const { merchantDefined1: userId, merchantDefined2: courseId, merchantDefined3: productType, } = paymentInfo;
        if (productType === ProductType.COURSE) {
            const result = await createOrderCourse({ courseId, userId, referenceNo, paymentInfo });
            res.status(200).json({
                success: true,
                result,
            });
        }
        else if (productType === ProductType.EBOOK) {
            res.status(200).json({
                success: true,
            });
        }
        else {
            return next(new ErrorHandler_1.default('productType not found', 500));
        }
    }
    catch (error) {
        console.log("🚀 ~ file: order.controller.ts:155 ~ error:", error);
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
const createOrderEbookSlip = async ({ ebookId, userId, referenceNo, paymentInfo, }) => {
    try {
        const user = await user_model_1.default.findById(userId);
        const ebook = await ebook_model_1.default.findById(ebookId);
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
                await (0, sendMail_1.default)({
                    email: user.email,
                    subject: "Order Confirmation",
                    template: "order-confirmation.ejs",
                    data: mailData,
                });
            }
        }
        catch (error) {
            console.log("🚀 ~ createOrderEbookSlip error:", error);
        }
        user?.ebooks.push(ebook?._id);
        await redis_1.redis.set(userId, JSON.stringify(user));
        await user?.save();
        notification_Model_1.default.create({
            user: user?._id,
            title: "New Order",
            message: `You have a new order from ${ebook?.name}`,
        });
        ebook.purchased = ebook.purchased + 1;
        await ebook.save();
        const data = {
            ebookId,
            userId,
            payment_info: paymentInfo ?? {},
            referenceNo,
        };
        const resultOrder = await orderEbook_model_1.default.create(data);
        return {
            ebookId: resultOrder.ebookId,
            referenceNo: resultOrder.referenceNo,
        };
    }
    catch (error) {
        throw new Error(error.message);
    }
};
const checkName = (displayName) => {
    return displayName?.includes(process.env.BANK_ACCOUNT_NAME_EN + '') || displayName?.includes(process.env.BANK_ACCOUNT_NAME_TH + '');
};
const getBankNoNumber = (bankNoPattern) => {
    if (!bankNoPattern)
        return 'not-match-bank-no';
    return bankNoPattern?.replace?.(/\D/g, '');
};
const checkBankNo = (receiver) => {
    const isBankAccount = process.env.BANK_ACCOUNT_NO?.includes(getBankNoNumber(receiver?.account?.value || ''));
    const isBankProxy = process.env.BANK_ACCOUNT_NO?.includes(getBankNoNumber(receiver?.proxy?.value || ''));
    return isBankAccount || isBankProxy;
};
const checkDuplicateOrder = async (transRef, productType) => {
    let order = [];
    if (productType === ProductType.COURSE) {
        order = await order_Model_1.default.find({ referenceNo: transRef });
    }
    else if (productType === ProductType.EBOOK) {
        order = await orderEbook_model_1.default.find({ referenceNo: transRef });
    }
    if (order.length > 0) {
        return 'สลิปนี้ถูกใช้แล้ว';
    }
    return false;
};
const checkSlip = async (qrData, product, productType) => {
    const dataSlip = await checkSlipApi.inquiry(qrData);
    if (dataSlip) {
        console.debug('checkSlip result: =>', {
            receiver: dataSlip?.data?.receiver,
            data: dataSlip?.data,
        });
        const isChecked = await checkDuplicateOrder(dataSlip?.data?.transRef, productType);
        if (isChecked) {
            throw new Error(isChecked);
        }
        const isCorrectName = checkName(dataSlip?.data?.receiver?.displayName);
        const isCorrectBackNo = checkBankNo(dataSlip?.data?.receiver);
        const isCorrectAmount = dataSlip?.data?.amount == product?.price;
        if (!isCorrectBackNo) {
            throw new Error('เลขบัญชีไม่ถูกต้อง');
        }
        if (!isCorrectName) {
            throw new Error('ชื่อผู้รับเงินไม่ถูกต้อง');
        }
        if (!isCorrectAmount) {
            throw new Error(`จำนวนเงินไม่ถูกต้อง`);
        }
        return dataSlip;
    }
    else {
        throw new Error('ไม่พสลิป');
    }
};
exports.verifySlip = (0, catchAsyncErrors_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { productType, productId, qrData, addressInfo } = req.body;
        const userId = req.user?._id;
        if (!productType || !productId || !qrData) {
            return next(new ErrorHandler_1.default('productType, productId, qrData is required', 500));
        }
        if (productType === ProductType.COURSE) {
            const [product, user] = await Promise.all([
                course_model_1.default.findById(productId),
                user_model_1.default.findById(userId)
            ]);
            if (!product) {
                return next(new ErrorHandler_1.default('Course not found', 500));
            }
            const courseExistInUser = user?.courses.some((course) => course._id.toString() === productId);
            if (courseExistInUser) {
                return next(new ErrorHandler_1.default("You have already purchased this course", 400));
            }
            const resultSlip = await checkSlip(qrData, product, ProductType.COURSE);
            const result = await createOrderCourse({ courseId: productId, userId, referenceNo: resultSlip.data.transRef, paymentInfo: resultSlip, addressInfo });
            res.status(200).json({
                success: true,
                result,
            });
        }
        else if (productType === ProductType.EBOOK) {
            const [product, user] = await Promise.all([
                ebook_model_1.default.findById(productId),
                user_model_1.default.findById(userId)
            ]);
            if (!product) {
                return next(new ErrorHandler_1.default('Ebook not found', 500));
            }
            const ebookExistInUser = user?.ebooks.some((ebook) => ebook._id.toString() === productId);
            if (ebookExistInUser) {
                return next(new ErrorHandler_1.default("You have already purchased this ebook", 400));
            }
            const resultSlip = await checkSlip(qrData, product, ProductType.EBOOK);
            const result = await createOrderEbookSlip({ ebookId: productId, userId, referenceNo: resultSlip.data.transRef, paymentInfo: resultSlip });
            console.log("🚀 ~ result:", result);
            res.status(200).json({
                success: true,
                result,
            });
        }
        else {
            return next(new ErrorHandler_1.default('productType not found', 500));
        }
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
});
