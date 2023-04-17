const {PayloadException} = require("./payloadException");
class DataException extends PayloadException {
    name = "data";

    constructor(message, code = 400) {
        super(message, code);
        this.tree += `/${this.name}`;
    }
}

module.exports = {
    DataException
}