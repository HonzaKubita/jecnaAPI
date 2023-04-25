const {PayloadException} = require("./payloadException");

class LoginException extends PayloadException {
    name = "login";

    constructor(message) {
        super(message, 401);
        this.tree += `/${this.name}`;
    }
}

module.exports = {
    LoginException
};