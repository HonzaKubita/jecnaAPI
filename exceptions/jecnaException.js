class JecnaException extends Error {
    name = "exception";
    tree = this.type;

    constructor(message, code) {
        super(message);
        this.code = code;
    }
}

module.exports = {
    JecnaException
}