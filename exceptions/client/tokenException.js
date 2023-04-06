const PayloadException = require("./payloadException");
module.exports = class TokenException extends PayloadException {
    type = "token";

    constructor(message, code) {
        super(message, 401);
        this.tree += `/${this.type}`;
    }
}