const {constants} = require('./constants');
const TokenException = require('../exceptions/client/tokenException');
const PayloadException = require('../exceptions/client/payloadException');
const ClientException = require('../exceptions/client/clientException');
const DataException = require('../exceptions/client/dataException');
const {userLoggedIn} = require("./utils");

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
 * @param headers{AxiosHeaders} The headers of the request
 * @param type{string[]} An array of strings, represents all possible values for the header
 */
function payloadIsType(headers, type = ["application/json"]) {
    const contentTypeHeader = headers['content-type'];
    if (contentTypeHeader === undefined) throw new ClientException("Request has no Content-Type header!");
    if (!type.includes(contentTypeHeader)) throw new PayloadException("The payload has wrong content type!");
}

/**
 * Returns a value of field or a default value
 * @param field{string | undefined} The field value, can be undefined
 * @param fieldName{string} The name of the field for error messages
 * @param defaultValue{string|null} The default value, if it's null, the field is required
 * @returns {string} The final value of the field
 */
function getSafeField(field, fieldName, defaultValue = null) {
    if (defaultValue === null && field === undefined) throw new DataException(`Required field '${fieldName}' is missing in the payload!`);
    return (field === undefined ? defaultValue : field).toString();
}

/**
 * Returns a number value of field or a default value
 * @param field{string|undefined} The field value, can be undefined
 * @param fieldName{string} The name of the field for error messages
 * @param defaultValue{number|null} The default value, if it's null, the field is required
 * @returns {number} The final value for the field
 */
function getSafeNumberField(field, fieldName, defaultValue = null) {
    if (defaultValue === null && field === undefined) throw new DataException(`Required field '${fieldName}' is missing in the payload!`);
    const value = Number(field === undefined ? defaultValue : field);
    if (isNaN(value)) throw new DataException(`Field '${fieldName}' is not a number!`);
    return value;
}

/**
 * Returns a boolean value of field or a default value
 * @param field{string|undefined} The field value, can be undefined
 * @param fieldName{string} The name of the field for error messages
 * @param defaultValue{boolean|null} The default value, if it's null, the field is required
 * @returns {boolean} The final value for the field
 */
function getSafeBooleanField(field, fieldName, defaultValue = null) {
    if (defaultValue === null && field === undefined) throw new DataException(`Required field '${fieldName}' is missing in the payload!`);
    return Boolean(field === undefined ? defaultValue : field);
}

module.exports = {
    tokenValid,
    siteFound,
    payloadIsType,
    getSafeField,
    getSafeNumberField,
    getSafeBooleanField
}