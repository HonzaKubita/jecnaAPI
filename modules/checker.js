const {constants} = require("./constants");
const {TokenException} = require("../exceptions/client/tokenException");
const {PayloadException} = require("../exceptions/client/payloadException");
const {DataException} = require("../exceptions/client/dataException");
const {documentOf, getContentType} = require("./utils");

function tokenValid(htmlBody) {
    if (!userLoggedIn(htmlBody))
        throw new TokenException("Invalid token!");
}

function siteFound(htmlBody, what) {
    for (const message of constants.jecna.notFoundMessages)
        if (htmlBody.includes(message)) throw new DataException(`${what} was not found!`, 404);
}

function payloadIsType(headers, type) {
    if (type !== getContentType(headers)) throw new PayloadException("The payload has wrong content type!");
}

function payloadIsJSON(headers) {
    payloadIsType(headers, "application/json");
}

function userLoggedIn(htmlBody) {
    return documentOf(htmlBody).getElementsByClassName("user-menu").length !== 0;
}

module.exports = {
    tokenValid,
    siteFound,
    userLoggedIn,
    payloadIsType,
    payloadIsJSON
};