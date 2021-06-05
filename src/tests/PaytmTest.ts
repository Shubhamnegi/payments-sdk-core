import * as dotenv from 'dotenv'
import * as path from 'path'
dotenv.config({
    path: path.join(__dirname, "../../.env")
});


import { PaytmIntegration } from "../Integrations/Paytm/PaytmIntegration"
import { expect } from 'chai';

describe("Paytm Test Suite", () => {
    const PAYTM_BASEURL = process.env.PAYTM_BASEURL as string
    const PAYTM_MID = process.env.PAYTM_MID as string
    const PAYTM_SECRET = process.env.PAYTM_SECRET as string
    const PAYTM_WEBSITE = process.env.PAYTM_WEBSITE as string
    const PAYTM_INDUSTRY_TYPE = process.env.PAYTM_INDUSTRY_TYPE as string
    const PAYTM_CHANNEL_ID = process.env.PAYTM_CHANNEL_ID as string
    
    const orderId = "ORDER_ID_" + Math.ceil(Math.random() * 1000);

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
            100,
            {
                custId: customerId
            }
        )
        console.log(result);
        expect(result).to.haveOwnProperty('data');
        expect(result.data).to.haveOwnProperty('head');
        expect(result.data).to.haveOwnProperty('body');
        expect(result.data.body).to.haveOwnProperty('txnToken');
        expect(result.data.body.txnToken).to.be.not.null;  
    })
})