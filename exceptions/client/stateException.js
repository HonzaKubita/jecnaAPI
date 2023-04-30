const {ClientException} = require("./clientException");

class StateException extends ClientException {
    name = "state";

    constructor(message, code = 409) {
        super(message, code);
        this.tree += `/${this.name}`;
    }
}

module.exports = {
    StateException
};