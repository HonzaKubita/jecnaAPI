const ServerException = require("./serverException");
module.exports = class ParserException extends ServerException {
    type = "parser";

    constructor(message) {
        super(message);
        this.tree += `/${this.type}`;
    }
}