import { PaytmIntegration } from "./PaytmIntegration";
import { PaytmCustomerInfo } from "./PaytmInterface";

export class PaytmBuilder {
    private baseurl?: string;
    private mid?: string;
    private secret?: string;
    private webiste?: string;
    private industryType?: string;
    private channelId?: string;
    private callbackUrl?: string;
    private orderId?: string;
    private txnAmount?: string;
    private customer?: PaytmCustomerInfo;
    private txnId?: string;
    private refundAmount?: string;
    private integration?: PaytmIntegration


    constructor(
        baseurl: string,
        mid: string,
        secret: string
    ) {
        // mandatory keys
        this.baseurl = baseurl;
        this.mid = mid;
        this.secret = secret;
    }

    setWebiste(webiste: string) {
        this.webiste = webiste;
        return this;
    }

    setIndustryType(industryType: string) {
        this.industryType = industryType;
        return this;
    }

    setChannelId(channelId: string) {
        this.industryType = channelId;
        return this;
    }

    setCallbackUrl(callbackUrl: string) {
        this.industryType = callbackUrl;
        return this;
    }

    setOrderId(orderId: string) {
        this.orderId = orderId;
        return this;
    }

    setTxnAmount(txnAmount: string) {
        this.txnAmount = txnAmount;
        return this;
    }

    setCustomer(customer: PaytmCustomerInfo) {
        this.customer = customer;
        return this;
    }
    setTxnId(txnId: string) {
        this.txnId = txnId;
        return this;
    }

    setRefundAmount(refundAmount: string) {
        this.refundAmount = refundAmount;
        return this;
    }

    createIntegration() {
        this.integration = new PaytmIntegration(
            this.baseurl as string,
            this.mid as string,
            this.secret as string,
            this.webiste as string,
            this.industryType as string,
            this.channelId as string,
            this.callbackUrl as string
        )
    }

    getIntegration() {
        if (!this.integration) {
            throw new Error("Please use createIntegration before getintegration")
        }
        return this.integration as PaytmIntegration
    }

    initiateTransaction() {
        if (!this.integration) {
            throw new Error("Please use createIntegration before initiateTransaction")
        }
        const integration = this.integration as PaytmIntegration;
        return integration.initiateTransaction(
            this.orderId as string,
            this.txnAmount as string,
            this.customer as PaytmCustomerInfo
        )
    }

    orderStatus() {
        if (!this.integration) {
            throw new Error("Please use createIntegration before orderStatus")
        }
        const integration = this.integration as PaytmIntegration;
        return integration.orderStatus(this.orderId as string)
    }


    refundOrder() {
        if (!this.integration) {
            throw new Error("Please use createIntegration before refundOrder")
        }
        const integration = this.integration as PaytmIntegration;
        return integration.refundOrder(
            this.orderId as string,
            this.txnId as string,
            this.refundAmount as string
        )
    }

    getRefundStatus() {
        if (!this.integration) {
            throw new Error("Please use createIntegration before getRefundStatus")
        }
        const integration = this.integration as PaytmIntegration;
        return integration.getRefundStatus(this.orderId as string)
    }
}