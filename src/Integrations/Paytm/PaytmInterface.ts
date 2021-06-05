export interface PaytmCustomerInfo {
    custId: string;
    mobile?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
}



export interface PaytmResponseHead {
    responseTimestamp: string;
    signature: string;
    version: string;
    clientId?: string,
}

export interface PaytmResultInfo {
    resultStatus: string;
    resultCode: string;
    resultMsg: string;
}


export interface PaytmInitTransactionResponse {
    resultInfo: PaytmResultInfo;
    txnToken: string;
    isPromoCodeValid: boolean;
    authenticated: boolean;
}
export interface PaytmTransactionStatusResponse {
    resultInfo: PaytmResultInfo;
    txnId: string;
    bankTxnId: string;
    orderId: string;
    txnAmount: string;
    txnType: string;
    gatewayName: string;
    bankName: string;
    mid: string;
    paymentMode: string;
    refundAmt: string;
    txnDate: string;
}

export interface PaytmRefundResponse {
    txnTimestamp: string;
    orderId: string;
    mid: string;
    refId: string;
    resultInfo: PaytmResultInfo;
    refundId: string;
    txnId: string;
    refundAmount: string;
}

export interface PaytmRefundDetailInfoList {
    refundType: string;
    payMethod: string;
    userCreditExpectedDate: string;
    userMobileNo: string;
    refundAmount: string;
}
export interface PaytmAgentInfo {
    name: string;
    employeeId: string;
    phoneNo: string;
    email: string;
}
export interface PaytmRefundStatusResponse {
    orderId: string;
    userCreditInitiateStatus: string;
    mid: string;
    merchantRefundRequestTimestamp: string;
    resultInfo: PaytmResultInfo;
    txnTimestamp: string;
    acceptRefundTimestamp: string;
    acceptRefundStatus: string;
    refundDetailInfoList: PaytmRefundDetailInfoList[];
    userCreditInitiateTimestamp: string;
    totalRefundAmount: string;
    refId: string;
    txnAmount: string;
    refundId: string;
    txnId: string;
    refundAmount: string;
    refundReason: string;
    agentInfo: PaytmAgentInfo;
}
export interface PaytmResponse<T> {
    head: PaytmResponseHead;
    body: T;
}



