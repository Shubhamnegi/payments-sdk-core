declare module 'paytmchecksum' {
    export function generateSignature(body: string, secret: string): Promise<string>
}
