module.exports = class Exception {

  isCustomException = true;
  type = 'exception';

  constructor(message) {
    this.message = message;
  }
}