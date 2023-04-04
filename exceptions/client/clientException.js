const Exception = require('../exception');

module.exports = class ClientException extends Exception {

  statusCode = 400;

  constructor(message) {
    super(message);
    this.type = 'clientException';
  }
}