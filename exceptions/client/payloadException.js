const {ClientException} = require("./clientException");
class PayloadException extends ClientException {
    name = "payload";

    constructor(message, code = 400) {
        super(message, code);
        this.tree += `/${this.name}`;
    }
}

module.exports = {
    PayloadException
}