const PayloadException = require('./payloadException');
module.exports = class DataException extends PayloadException {
    type = "data";

    constructor(message, code = 400) {
        super(message, code);
        this.tree += `/${this.type}`;
    }
}