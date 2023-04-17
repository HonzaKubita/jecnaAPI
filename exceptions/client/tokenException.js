const {PayloadException} = require("./payloadException");
class TokenException extends PayloadException {
    name = "token";

    constructor(message) {
        super(message, 401);
        this.tree += `/${this.name}`;
    }
}

module.exports = {
    TokenException
}