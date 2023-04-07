module.exports = class Exception {
    isCustom = true;

    type = "exception";
    tree = this.type;

    constructor(message, code) {
        this.message = message;
        this.code = code;
    }
}