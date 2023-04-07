const PayloadException = require("./payloadException");
module.exports = class LoginException extends PayloadException {
    type = "login";

    constructor(message) {
        super(message, 401);
        this.tree += `/${this.type}`;
    }
}