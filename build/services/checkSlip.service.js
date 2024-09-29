"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckSlipService = void 0;
const axios_1 = __importDefault(require("axios"));
const baseUrl = "https://suba.rdcw.co.th/v1";
const slipSecretKey = process.env.BANK_SECRET_KEY ?? '';
const slipClientId = process.env.BANK_CLIENT_ID ?? '';
const authToken = Buffer.from(`${slipClientId}:${slipSecretKey}`).toString('base64');
const axiosInstant = axios_1.default.create({
    baseURL: baseUrl,
    headers: {
        "Content-Type": "application/json",
        'Authorization': `Basic ${authToken}`,
    },
});
class CheckSlipService {
    constructor() { }
    async inquiry(payload) {
        try {
            const response = await axiosInstant.post(`/inquiry`, {
                payload
            });
            return response.data;
        }
        catch (error) {
            console.log("🚀 ~ CheckSlipService ~ inquiry ~ error:", error);
            throw new Error(error?.data?.message || error?.message || "Failed to verify payment");
        }
    }
}
exports.CheckSlipService = CheckSlipService;
