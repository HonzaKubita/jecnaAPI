const TokenException = require('../exceptions/client/tokenException');

module.exports = (htmlBody) => {
    if (htmlBody.contains("Pro pokračování se přihlaste do systému"))
        throw new TokenException("Token Invalid");
}