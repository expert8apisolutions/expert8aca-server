import axios from "axios";

const baseUrl = "https://suba.rdcw.co.th/v1";

const slipSecretKey = process.env.BANK_SECRET_KEY ?? '';
const slipClientId = process.env.BANK_CLIENT_ID ?? '';

const authToken = Buffer.from(`${slipClientId}:${slipSecretKey}`).toString('base64')

const axiosInstant = axios.create({
    baseURL: baseUrl,
    headers: {
        "Content-Type": "application/json",
        'Authorization': `Basic ${authToken}`,
    },
});

export class CheckSlipService {

    constructor() { }

    async inquiry(payload: string): Promise<any> {
        try {
            const response = await axiosInstant.post(
                `/inquiry`,
                {
                    payload
                },
            );
            return response.data;
        } catch (error: any) {
            console.log("🚀 ~ CheckSlipService ~ inquiry ~ error:", error)
            throw new Error(error?.data?.message as string || error?.message || "Failed to verify payment");
        }
    }
}
