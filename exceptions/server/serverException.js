const Exception = require('../exception');

module.exports = class ServerException extends Exception {

  statusCode = 500;

  constructor(message) {
    super(message);
    this.type += "/serverException";
  }
}