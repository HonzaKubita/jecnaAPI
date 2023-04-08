const Exception = require('../exception');
module.exports = class ServerException extends Exception {
    type = "server";

    constructor(message, code = 500) {
        super(message, code);
        this.tree += `/${this.type}`;
    }
}