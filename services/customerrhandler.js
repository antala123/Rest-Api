class allcustomErrorHandler extends Error {
    constructor(status, msg) {
        super();
        this.status = status;
        this.message = msg;
    }

    // Register:
    static alreadyExist(message) {
        return new allcustomErrorHandler(409, message);
    }

    // Login:
    static wrongDetail(message = 'Email and Password Invalid') {
        return new allcustomErrorHandler(403, message);
    }

    // User:
    static unauth(message = 'unauthorized') {
        return new allcustomErrorHandler(403, message);
    }

    // usercontroller:
    static notfound(message = '404 Not Found') {
        return new allcustomErrorHandler(403, message)
    }

    // productcontroller:
    static serverError(message) {
        return new allcustomErrorHandler(403, message)
    }
}

export default allcustomErrorHandler;