declare module 'paytmchecksum' {
    class PaytmChecksum {
        static generateSignature(params: string, key: string): Promise<string>
    }
    export default PaytmChecksum
}
