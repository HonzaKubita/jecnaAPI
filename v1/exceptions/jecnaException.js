class JecnaException extends Error {
    name = "exception";
    tree = this.name;

    constructor(message, code) {
        super(message);
        this.code = code;
    }
}

module.exports = {
    JecnaException
};