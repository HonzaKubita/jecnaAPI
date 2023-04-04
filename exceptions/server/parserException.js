module.exports = class ParserException {

  constructor(message) {
    super(message);
    this.type += "/parserException"
  }
}