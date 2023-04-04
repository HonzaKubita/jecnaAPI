const ClientException = require("./clientException");

module.exports = class TokenException extends ClientException{
    constructor(message) {
      super(message);
      this.statusCode = 401;
      this.type += "/tokenException"
    }
}