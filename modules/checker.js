const {constants} = require("./constants");
const TokenException = require("../exceptions/client/tokenException");
const PayloadException = require("../exceptions/client/payloadException");
const DataException = require("../exceptions/client/dataException");
const {documentOf, getContentType} = require("./utils");

/**
 * Throws an exception if the token is not valid
 * @param htmlBody{string} The HTML body of the jecna server response
 */
function tokenValid(htmlBody) {
    if (!userLoggedIn(htmlBody))
        throw new TokenException("Invalid token!");
}

/**
 * Throws an exception if something was not found
 * @param htmlBody{string} The HTML body of the jecna server response
 * @param what{string} A string telling what was there to found. Used for error messages
 */
function siteFound(htmlBody, what) {
    for (const message of constants.jecna.notFoundMessages)
        if (htmlBody.includes(message)) throw new DataException(`${what} was not found!`, 404);
}

/**
 * Throws an exception if a Content-Type header is undefined or if it is not one of the provided options
 * @param headers{Headers} The headers of the request
 * @param type{string} An array of strings, represents all possible values for the header
 */
function payloadIsType(headers, type = "application/json") {
    if (type !== getContentType(headers)) throw new PayloadException("The payload has wrong content type!");
}
/**
 * Returns if the user is logged in based on the jecna server response
 * @param htmlBody{string} The response
 * @returns {boolean} If the user is logged in
 */
function userLoggedIn(htmlBody) {
    return documentOf(htmlBody).getElementsByClassName("user-menu").length !== 0;
}

module.exports = {
    tokenValid,
    siteFound,
    userLoggedIn,
    payloadIsType
}