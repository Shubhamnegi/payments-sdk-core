export class CustomError {
    private err: Error
    public message: string;
    public name: string;
    public stack?: string;

    constructor(err: Error) {
        this.err = err;
        this.message = err.message
        this.name = err.name
        this.stack = err.stack
    }
}
