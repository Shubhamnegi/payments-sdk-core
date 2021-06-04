export class PaytmIntegration {
    private mid: string;
    private secret: string

    constructor(mid: string, secret: string) {
        // Mid and secret shared by paytm 
        this.mid = mid;
        this.secret = secret
    }
}

