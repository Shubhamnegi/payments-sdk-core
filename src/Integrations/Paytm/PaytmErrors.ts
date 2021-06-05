import { CustomError } from "../../Helpers/CustomErrors";

export class PaytmErrorInvalidOrderId extends CustomError {
    constructor(orderId?: any) {
        super(new Error("Invalid OrderId. Please check order Id. You have passed" + orderId))
    }
}

export class PaytmErrorInvalidAmount extends CustomError {
    constructor(amount?: any) {
        super(new Error("Invalid order amount. Please check order amount. You have passed " + amount))
    }
}

export class PaytmErrorInvalidCustomerInfo extends CustomError {
    constructor(customer?: object) {
        super(new Error("Invalid customer info. Please check mandatory keys. You have passed " + JSON.stringify(customer)))
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