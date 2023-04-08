const Exception = require('../exception');
module.exports = class ClientException extends Exception {
    type = "client";

    constructor(message, code = 400) {
        super(message, code);
        this.tree += `/${this.type}`;
    }
}