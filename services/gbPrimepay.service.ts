import axios from "axios";

const baseUrl = "https://api.gbprimepay.com";

const gbPrimeSecretKey = process.env.GB_PRIME_SECRET_KEY;
const gbPrimePublicKey = process.env.GB_PRIME_PUBLIC_KEY;

const axiosInstant = axios.create({
    baseURL: baseUrl,
    headers: {
        "Content-Type": "application/json",
    },
});

export class GbPrimepayService {

    constructor() { }

    async getAuthToken() {
        try {
            const response = await axiosInstant.post(
                `/unified/authToken/create`,
                {
                    secretKey: gbPrimeSecretKey,
                    publicKey: gbPrimePublicKey,
                },
            );

            const { resultCode, authToken } = response.data;
            if (resultCode !== "00") throw new Error("Failed to get auth token")

            return authToken
        } catch (e) {
            console.error(e);
            return null
        }
    }

    #generateRefernceNo = () => {
        return `GB${new Date().getTime()}`;
    };

    async createPaymentLink({
        amount,
        detail,
        customerName,
        customerEmail,
        userId,
        courseId,
        productType
    }: {
        amount: number,
        detail: string,
        customerName: string,
        customerEmail: string,
        userId: string,
        courseId: string,
        productType: string,
    }) {
        try {
            const authToken = await this.getAuthToken();
            const referenceNo = this.#generateRefernceNo();

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
            }
            console.log("🚀 ~ GbPrimepayService ~ reqBody:", reqBody)
            const response = await axiosInstant.post(
                `/unified/transaction`,
                reqBody,
                {
                    headers: {
                        Authorization: authToken,
                    },
                },
            );
            return response.data;
        } catch (error: any) {
            console.log(error);
            throw new Error(error?.message as string || "Failed to create payment link");
        }
    }

    async getTransaction(referenceNo: string) {
        try {
            const token = Buffer.from(`${gbPrimeSecretKey}:`).toString('base64')
            const response = await axiosInstant.post(
                `/v1/check_status_txn`,
                {
                    referenceNo,
                },
                {
                    headers: {
                        Authorization: `Basic ${token}`,
                    },
                },
            );
            return response.data;
        } catch (e) {
            console.log(e);
            return null
        }
    }
}
