const ClientException = require('./clientException');
module.exports = class PayloadException extends ClientException {
    type = "payload";

    constructor(message, code = 400) {
        super(message, code);
        this.tree += `/${this.type}`;
    }
}