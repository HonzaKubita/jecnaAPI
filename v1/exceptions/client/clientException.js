const {JecnaException} = require("../jecnaException");

class ClientException extends JecnaException {
    name = "client";

    constructor(message, code = 400) {
        super(message, code);
        this.tree += `/${this.name}`;
    }
}

module.exports = {
    ClientException
};