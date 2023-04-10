const ClientException = require("./clientException");
module.exports = class StateException extends ClientException {
    type = "state";

    constructor(message, code = 409) {
        super(message, code);
        this.tree += `/${this.type}`;
    }
}