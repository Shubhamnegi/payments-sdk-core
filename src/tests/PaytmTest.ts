import * as dotenv from 'dotenv'
import * as path from 'path'
dotenv.config({
    path: path.join(__dirname, "../../.env")
});


import { PaytmIntegration } from "../Integrations/Paytm/PaytmIntegration"
import { expect } from 'chai';
import { PaytmBuilder } from '../Integrations/Paytm/PaytmBuilder';


const PAYTM_BASEURL = process.env.PAYTM_BASEURL as string
const PAYTM_MID = process.env.PAYTM_MID as string
const PAYTM_SECRET = process.env.PAYTM_SECRET as string
const PAYTM_WEBSITE = process.env.PAYTM_WEBSITE as string
const PAYTM_INDUSTRY_TYPE = process.env.PAYTM_INDUSTRY_TYPE as string
const PAYTM_CHANNEL_ID = process.env.PAYTM_CHANNEL_ID as string


describe("Paytm Test Suite", () => {

    const orderId = "ORDER_ID_" + Math.ceil(Math.random() * 1000);
    // const orderId = "ORDER_ID_429";

    const integration = new PaytmIntegration(
        PAYTM_BASEURL,
        PAYTM_MID,
        PAYTM_SECRET,
        PAYTM_WEBSITE,
        PAYTM_INDUSTRY_TYPE,
        PAYTM_CHANNEL_ID,
        "/some/url"
    );
    it("Should be able generate checksum", async () => {
        const result = await integration.generateChecksum("sometext");
        expect(result).to.be.not.null;
    })

    it("should be able to intitate transaction", async () => {

        const customerId = "CUST_ID_" + Math.ceil(Math.random() * 100);
        const result = await integration.initiateTransaction(
            orderId,
            "100",
            {
                custId: customerId
            }
        )
        expect(result).to.haveOwnProperty('data');
        expect(result.data).to.haveOwnProperty('head');
        expect(result.data).to.haveOwnProperty('body');
        expect(result.data.body).to.haveOwnProperty('txnToken');
        expect(result.data.body.txnToken).to.be.not.null;
    })

    it("should be able to get transaction status", async () => {
        const result = await integration.orderStatus(orderId);

        expect(result).to.haveOwnProperty('data');
        expect(result.data).to.haveOwnProperty('head');
        expect(result.data).to.haveOwnProperty('body');
        expect(result.data.body).to.haveOwnProperty('resultInfo');
        expect(result.data.body.resultInfo).to.haveOwnProperty('resultStatus');
    }).timeout(20000)

    it("should be able to refund transactions", async () => {
        const result = await integration.refundOrder(
            orderId,
            "randomId",
            "100"
        );
        console.log(result.data)
        expect(result).to.haveOwnProperty('data');
        expect(result.data).to.haveOwnProperty('head');
        expect(result.data).to.haveOwnProperty('body');
        expect(result.data.body).to.haveOwnProperty('resultInfo');
        expect(result.data.body.resultInfo).to.haveOwnProperty('resultStatus');
    }).timeout(20000)

    it("should be able to check refund status", async () => {
        const result = await integration.getRefundStatus(
            orderId
        );

        expect(result).to.haveOwnProperty('data');
        expect(result.data).to.haveOwnProperty('head');
        expect(result.data).to.haveOwnProperty('body');
        expect(result.data.body).to.haveOwnProperty('resultInfo');
        expect(result.data.body.resultInfo).to.haveOwnProperty('resultStatus');
    }).timeout(20000)



}).timeout(60000)

describe("Paytm Builder test suite", () => {
    const builder = new PaytmBuilder(PAYTM_BASEURL, PAYTM_MID, PAYTM_SECRET)
    const orderId = "ORDER_ID_" + Math.ceil(Math.random() * 1000);
    // const orderId = "ORDER_ID_863";

    it("should be able to create an order", async () => {

        builder.setWebiste(PAYTM_WEBSITE);
        builder.setIndustryType(PAYTM_INDUSTRY_TYPE);
        builder.setChannelId(PAYTM_CHANNEL_ID);
        builder.setCallbackUrl("/some/url");
        builder.setOrderId(orderId);
        builder.setTxnAmount("100");
        builder.setCustomer({
            custId: "some_customer"
        })
        builder.createIntegration()

        const result = await builder.initiateTransaction();

        expect(result).to.haveOwnProperty('data');
        expect(result.data).to.haveOwnProperty('head');
        expect(result.data).to.haveOwnProperty('body');
        expect(result.data.body).to.haveOwnProperty('txnToken');
        expect(result.data.body.txnToken).to.be.not.null;

    })

    it("should be able to get order status", async () => {
        builder.setOrderId(orderId);
        builder.createIntegration();

        const result = await builder.orderStatus();
        expect(result).to.haveOwnProperty('data');
        expect(result.data).to.haveOwnProperty('head');
        expect(result.data).to.haveOwnProperty('body');
        expect(result.data.body).to.haveOwnProperty('resultInfo');
        expect(result.data.body.resultInfo).to.haveOwnProperty('resultStatus');
    }).timeout(60000)

    it("should be able to get refund order", async () => {
        builder.setOrderId(orderId);
        builder.setTxnId("sometxn");
        builder.setRefundAmount("100")
        builder.createIntegration();

        const result = await builder.refundOrder();
        expect(result).to.haveOwnProperty('data');
        expect(result.data).to.haveOwnProperty('head');
        expect(result.data).to.haveOwnProperty('body');
        expect(result.data.body).to.haveOwnProperty('resultInfo');
        expect(result.data.body.resultInfo).to.haveOwnProperty('resultStatus');
    });

    it("should be able to get refund status", async () => {
        builder.setOrderId(orderId);
        builder.createIntegration();

        const result = await builder.getRefundStatus();
        expect(result).to.haveOwnProperty('data');
        expect(result.data).to.haveOwnProperty('head');
        expect(result.data).to.haveOwnProperty('body');
        expect(result.data.body).to.haveOwnProperty('resultInfo');
        expect(result.data.body.resultInfo).to.haveOwnProperty('resultStatus');
    });
})