import {
    PaytmErrorInvalidAmount,
    PaytmErrorInvalidCustomerInfo,
    PaytmErrorInvalidOrderId,
    PaytmErrorOrderCreationFailed,
    PaytmErrorGettingPaymentStatus,
    PaytmErrorInvalidTransactionId,
    PaytmErrorRefundFailed,
    PaytmErrorRefundStatusCheckFailed
} from "./PaytmErrors";
import {
    PaytmCustomerInfo,
    PaytmResponse,
    PaytmInitTransactionResponse,
    PaytmTransactionStatusResponse,
    PaytmRefundResponse,
    PaytmRefundStatusResponse
} from "./PaytmInterface";
import * as PaytmChecksum from 'paytmchecksum';
import * as Bunyan from "bunyan"
import { getLogger } from "../../Helpers/CustomLogger";
import * as  axios from 'axios'


/**
 * This class with help in interating with paytm backend
 * The main objective is 
 *  - To create an order
 *  - To check transaction status
 *  - To refund/void a transaction
 */
export class PaytmIntegration {
    private baseurl: string;
    private mid: string;
    private secret: string;
    private webiste: string;
    private industryType: string;
    private channelId: string;
    private callbackUrl: string;
    private currency = "INR"
    private logger: Bunyan
    private refundPrefix = "REFUNDID_";


    constructor(
        baseurl: string,
        mid: string,
        secret: string,
        webiste: string,
        industryType: string,
        channelId: string,
        callbackUrl: string
    ) {
        this.logger = getLogger("PaytmIntegration")
        // Mid and secret shared by paytm 
        this.baseurl = baseurl;
        this.mid = mid;
        this.secret = secret;
        this.webiste = webiste;
        this.industryType = industryType;
        this.channelId = channelId;
        this.callbackUrl = callbackUrl;
    }

    /**
     * To register an order with paytm
     */
    async initiateTransaction(orderId: string, txnAmount: string, customer: PaytmCustomerInfo) {
        if (!orderId) {
            // Missing order id
            throw new PaytmErrorInvalidOrderId(orderId)
        }
        if (
            txnAmount === null ||
            (typeof txnAmount === "string" && txnAmount.trim() === "")
        ) {
            // Missing transaction amount
            throw new PaytmErrorInvalidAmount(txnAmount)
        }
        if (customer.custId == null) {
            throw new PaytmErrorInvalidCustomerInfo(customer)
        }
        // Set Logger
        const logger = this.logger.child({
            orderId: orderId
        })

        // All reqired field checks have passed
        const paytmParams: any = {};
        paytmParams.body = {
            "requestType": "Payment",
            "mid": this.mid,
            "websiteName": this.webiste,
            "orderId": orderId,
            "callbackUrl": this.callbackUrl,
            "txnAmount": {
                "value": txnAmount,
                "currency": this.currency,
            },
            "userInfo": customer,
        };
        const checksum = await this.generateChecksum(JSON.stringify(paytmParams.body))
        paytmParams.head = {
            "signature": checksum
        }
        logger.debug(paytmParams);

        const ep = `/theia/api/v1/initiateTransaction?mid=${this.mid}&orderId=${orderId}`;

        // request paytm to create order
        let result: axios.AxiosResponse<PaytmResponse<PaytmInitTransactionResponse>>;
        try {
            result = await axios.default.post(this.baseurl + ep, paytmParams, {
                headers: {
                    "content-type": "application/json",
                }
            })
        } catch (error) {
            logger.error(error)
            throw new PaytmErrorOrderCreationFailed(error);
        }
        return result;
    }

    /**
     * To get transactin status from paytm
     * This can be used to check status at multiple levels while updating data in out our database
     * @param orderId 
     */
    async orderStatus(orderId: string) {
        if (!orderId) {
            throw new PaytmErrorInvalidOrderId(orderId);
        }
        const logger = this.logger.child({ orderId })
        const paytmParams: any = {}

        paytmParams.body = {
            "mid": this.mid,
            "orderId": orderId,
        };
        const checksum = await this.generateChecksum(JSON.stringify(paytmParams.body))
        paytmParams.head = {
            "signature": checksum
        };
        logger.debug(paytmParams);

        const ep = "/v3/order/status";
        let result: axios.AxiosResponse<PaytmResponse<PaytmTransactionStatusResponse>>;

        try {
            result = await axios.default.post(
                this.baseurl + ep,
                paytmParams,
                {
                    headers: {
                        "content-type": "application/json"
                    }
                });
        } catch (error) {
            logger.error(error);
            throw new PaytmErrorGettingPaymentStatus(error)
        }
        return result;
    }

    /**
     * To inititate refund request, This doesn't garuntee refund use getRefundStatus to check status
     * @param orderId 
     * @param txnId 
     * @param refundAmount 
     * @returns 
     */
    async refundOrder(orderId: string, txnId: string, refundAmount: string) {
        if (!orderId) {
            // Missing order id
            throw new PaytmErrorInvalidOrderId(orderId)
        }
        if (!txnId) {
            throw new PaytmErrorInvalidTransactionId(txnId)
        }
        if (
            refundAmount === null ||
            (typeof refundAmount === "string" && refundAmount.trim() === "")
        ) {
            // Missing refund amount
            throw new PaytmErrorInvalidAmount(refundAmount)
        }
        const logger = this.logger.child({ orderId })

        const paytmParams: any = {};

        paytmParams.body = {
            "mid": this.mid,
            "txnType": "REFUND",
            "orderId": orderId,
            "txnId": txnId,
            "refId": this.refundPrefix + orderId,
            "refundAmount": refundAmount,
        };

        const checksum = await this.generateChecksum(JSON.stringify(paytmParams.body))

        paytmParams.head = {
            "signature": checksum
        };

        logger.debug(paytmParams)

        const ep = "/refund/apply";
        let result: axios.AxiosResponse<PaytmResponse<PaytmRefundResponse>>;
        try {
            result = await axios.default.post(
                this.baseurl + ep,
                paytmParams,
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
        } catch (error) {
            logger.error(error)
            throw new PaytmErrorRefundFailed(error)
        }
        return result;
    }

    /**
     * To check refund status
     * @param orderId 
     * @returns 
     */
    async getRefundStatus(orderId: string) {
        if (!orderId) {
            // Missing order id
            throw new PaytmErrorInvalidOrderId(orderId)
        }
        const logger = this.logger.child({ orderId })
        const paytmParams: any = {};

        paytmParams.body = {
            "mid": this.mid,
            "orderId": orderId,
            "refId": this.refundPrefix + orderId,
        };
        const checksum = await this.generateChecksum(JSON.stringify(paytmParams.body))

        paytmParams.head = {
            "signature": checksum
        };
        logger.debug(paytmParams);

        const ep = "/v2/refund/status";
        let result: axios.AxiosResponse<PaytmResponse<PaytmRefundStatusResponse>>;
        try {
            result = await axios.default.post(
                this.baseurl + ep,
                paytmParams,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )
        } catch (error) {
            logger.error(error)
            throw new PaytmErrorRefundStatusCheckFailed(error)
        }
        return result;
    }

    async generateChecksum(data: string) {
        const checksum = await PaytmChecksum.default.generateSignature(data, this.secret)
        return checksum;
    }
}

