"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const style_1 = require("@/app/styles/style");
const ordersApi_1 = require("@/redux/features/orders/ordersApi");
const react_stripe_js_1 = require("@stripe/react-stripe-js");
const navigation_1 = require("next/navigation");
const react_1 = __importStar(require("react"));
const react_hot_toast_1 = require("react-hot-toast");
const socket_io_client_1 = __importDefault(require("socket.io-client"));
const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";
const socketId = (0, socket_io_client_1.default)(ENDPOINT, { transports: ["websocket"] });
const CheckOutForm = ({ setLoadingBackDrop, setOpenModalDownLoad, setOpen, data, user, refetch, payForm = 'course' }) => {
    const stripe = (0, react_stripe_js_1.useStripe)();
    const elements = (0, react_stripe_js_1.useElements)();
    const [message, setMessage] = (0, react_1.useState)("");
    const [createOrder, { data: orderData, error }] = (0, ordersApi_1.useCreateOrderMutation)();
    const [createOrderEbook, { data: orderDataEbook, error: errorEbook }] = (0, ordersApi_1.useCreateOrderEbookMutation)();
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) {
            return;
        }
        setIsLoading(true);
        setLoadingBackDrop?.(true);
        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            redirect: "if_required",
        });
        if (error) {
            setMessage(error.message);
            setIsLoading(false);
            setLoadingBackDrop?.(false);
        }
        else if (paymentIntent && paymentIntent.status === "succeeded") {
            setIsLoading(false);
            if (payForm === 'course') {
                setLoadingBackDrop?.(false);
                createOrder({ courseId: data._id, payment_info: paymentIntent });
            }
            else {
                createOrderEbook({ ebookId: data._id, payment_info: paymentIntent });
            }
        }
    };
    (0, react_1.useEffect)(() => {
        if (orderData) {
            refetch();
            socketId.emit("notification", {
                title: "New Order",
                message: `You have a new order from ${data.name}`,
                userId: user._id,
            });
            (0, navigation_1.redirect)(`/course-access/${data._id}`);
        }
        if (error) {
            if ("data" in error) {
                const errorMessage = error;
                react_hot_toast_1.toast.error(errorMessage.data.message);
            }
        }
    }, [orderData, error]);
    (0, react_1.useEffect)(() => {
        if (orderDataEbook) {
            refetch();
            socketId.emit("notification", {
                title: "New Order",
                message: `You have a new order from ${data.name}`,
                userId: user._id,
            });
            setOpen(false);
            setOpenModalDownLoad(true);
        }
        if (errorEbook) {
            if ("data" in errorEbook) {
                const errorMessage = error;
                react_hot_toast_1.toast.error(errorMessage.data.message);
            }
        }
    }, [orderDataEbook, errorEbook]);
    return (<form id="payment-form" onSubmit={handleSubmit}>
      <react_stripe_js_1.LinkAuthenticationElement id="link-authentication-element"/>
      <react_stripe_js_1.PaymentElement id="payment-element"/>
      <button disabled={isLoading || !stripe || !elements} id="submit">
      
        <span id="button-text" className={`${style_1.styles.button} mt-2 !h-[35px]`}>
          {isLoading ? "Paying..." : "Pay now"}
        </span>
      </button>
      {/* Show any error or success messages */}
      {message && (<div id="payment-message" className="text-[red] font-Poppins pt-2">
          {message}
        </div>)}
    </form>);
};
exports.default = CheckOutForm;
