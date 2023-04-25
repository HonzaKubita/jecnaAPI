const {JecnaException} = require("../jecnaException");

class ServerException extends JecnaException {
    name = "server";

    constructor(message, code = 500) {
        super(message, code);
        this.tree += `/${this.name}`;
    }
}

module.exports = {
    ServerException
};