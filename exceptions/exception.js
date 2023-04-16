module.exports = class Exception extends Error {
    isCustom = true;

    type = "exception";
    tree = this.type;

    constructor(message, code) {
        super(message);
        this.code = code;
    }
}