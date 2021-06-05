# payments-sdk-core

The main goal of this library to create integrate with multiple payment vendors so that you dont have to manage integrations your self.

## Supported Integration

- [Paytm](#paytm-implementation)

## Implmentation

### Paytm Implementation

For paytm merchant needs to get mid, secret from backend.
The Base url depends on the staging and live environment being used

### Create Order using builder

```
async ()=>{
        const builder = new PaytmBuilder(PAYTM_BASEURL, PAYTM_MID, PAYTM_SECRET)
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
}
```

### Get Order Status

```
async ()=>{
        const builder = new PaytmBuilder(PAYTM_BASEURL, PAYTM_MID, PAYTM_SECRET)

        builder.setOrderId(orderId);
        builder.createIntegration();

        const result = await builder.orderStatus();
}
```

### Refund Order


```
async ()=>{
        const builder = new PaytmBuilder(PAYTM_BASEURL, PAYTM_MID, PAYTM_SECRET)

        builder.setOrderId(orderId);
        builder.setTxnId("sometxn");
        builder.setRefundAmount("100")
        builder.createIntegration();

        const result = await builder.refundOrder();
}
```

### Get Refund Status

```
        const builder = new PaytmBuilder(PAYTM_BASEURL, PAYTM_MID, PAYTM_SECRET)
        builder.setOrderId(orderId);
        builder.createIntegration();

        const result = await builder.getRefundStatus();
```
