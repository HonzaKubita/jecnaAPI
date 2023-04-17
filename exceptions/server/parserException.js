const {ServerException} = require("./serverException");
class ParserException extends ServerException {
    name = "parser";

    constructor(message) {
        super(message);
        this.tree += `/${this.name}`;
    }
}

module.exports = {
    ParserException
}