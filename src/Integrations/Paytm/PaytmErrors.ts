import { CustomError } from "../../Helpers/CustomErrors";

export class PaytmErrorInvalidOrderId extends CustomError {
    constructor(orderId?: any) {
        super(new Error("Invalid OrderId. Please check order Id. You have passed" + orderId))
    }
}

export class PaytmErrorInvalidAmount extends CustomError {
    constructor(amount?: any) {
        super(new Error("Invalid amount. Please check amount. You have passed " + amount))
    }
}

export class PaytmErrorInvalidCustomerInfo extends CustomError {
    constructor(customer?: object) {
        super(new Error("Invalid customer info. Please check mandatory keys. You have passed " + JSON.stringify(customer)))
    }
}
export class PaytmErrorInvalidTransactionId extends CustomError {
    constructor(txnId?: string) {
        super(new Error("Invalid Transaction id. This is the transcation id shared by paytm. You have passed " + txnId))
    }
}

export class PaytmErrorOrderCreationFailed extends CustomError {
    constructor(err: Error) {
        super(err)
    }
}
export class PaytmErrorGettingPaymentStatus extends CustomError {
    constructor(err: Error) {
        super(err)
    }
}
export class PaytmErrorRefundFailed extends CustomError {
    constructor(err: Error) {
        super(err)
    }
}