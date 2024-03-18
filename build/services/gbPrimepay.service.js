"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _GbPrimepayService_generateRefernceNo;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GbPrimepayService = void 0;
const axios_1 = __importDefault(require("axios"));
const baseUrl = "https://api.gbprimepay.com";
const gbPrimeSecretKey = process.env.GB_PRIME_SECRET_KEY;
const gbPrimePublicKey = process.env.GB_PRIME_PUBLIC_KEY;
const axiosInstant = axios_1.default.create({
    baseURL: baseUrl,
    headers: {
        "Content-Type": "application/json",
    },
});
class GbPrimepayService {
    constructor() {
        _GbPrimepayService_generateRefernceNo.set(this, () => {
            return `GB${new Date().getTime()}`;
        });
    }
    async getAuthToken() {
        try {
            const response = await axiosInstant.post(`/unified/authToken/create`, {
                secretKey: gbPrimeSecretKey,
                publicKey: gbPrimePublicKey,
            });
            const { resultCode, authToken } = response.data;
            if (resultCode !== "00")
                throw new Error("Failed to get auth token");
            return authToken;
        }
        catch (e) {
            console.error(e);
            return null;
        }
    }
    async createPaymentLink({ amount, detail, customerName, customerEmail, userId, courseId, productType }) {
        try {
            const authToken = await this.getAuthToken();
            const referenceNo = __classPrivateFieldGet(this, _GbPrimepayService_generateRefernceNo, "f").call(this);
            const reqBody = {
                apiType: "PC",
                createPaymentTransactionRequest: {
                    referenceNo,
                    paymentType: "Q",
                    amount,
                    responseUrl: `${process.env.GB_PRIME_REDIRECT_URL}?refId=${referenceNo}`,
                    backgroundUrl: `${process.env.GB_PRIME_WEBHOOK_URL}?randomKey=${process.env.GB_PRIME_WEBHOOK_KEY}`,
                    detail,
                    customerName,
                    customerEmail,
                    merchantDefined1: userId,
                    merchantDefined2: courseId,
                    merchantDefined3: productType,
                }
            };
            console.log("🚀 ~ GbPrimepayService ~ reqBody:", reqBody);
            const response = await axiosInstant.post(`/unified/transaction`, reqBody, {
                headers: {
                    Authorization: authToken,
                },
            });
            return response.data;
        }
        catch (error) {
            console.log(error);
            throw new Error(error?.message || "Failed to create payment link");
        }
    }
    async getTransaction(referenceNo) {
        try {
            const token = Buffer.from(`${gbPrimeSecretKey}:`).toString('base64');
            const response = await axiosInstant.post(`/v1/check_status_txn`, {
                referenceNo,
            }, {
                headers: {
                    Authorization: `Basic ${token}`,
                },
            });
            return response.data;
        }
        catch (e) {
            console.log(e);
            return null;
        }
    }
}
exports.GbPrimepayService = GbPrimepayService;
_GbPrimepayService_generateRefernceNo = new WeakMap();
