const ServerException=  require("../exceptions/server/serverException");
const {JSDOM} = require("jsdom");
const DataException = require("../exceptions/client/dataException");
const ClientException = require("../exceptions/client/clientException");

/**
 * Returns a cookie value from set-cookie header
 * @param name{string} The name of the cookie
 * @param resHeaders{AxiosHeaders} The headers object from the response
 * @return {string} The value of the cookie
 */
function getCookie(name, resHeaders) {
    let header = resHeaders["set-cookie"];
    if (header === undefined) throw new ServerException("Response from jecna server doesn't contain the Set-Cookie header.");

    const foundCookie = header.find(cookie =>
        cookie.includes(name) &&
        !cookie.includes("deleted") &&
        !cookie.includes(`${name}=;`)
    );
    if (foundCookie === undefined) throw new ServerException(`The Set-Cookie header does not contain a cookie with name ${name}.`);

    return foundCookie?.match(new RegExp(`^${name}=(.+?);`))?.[1];
}

/**
 * Returns the document object from the raw response data
 * @param responseData{string} The data
 * @returns {Document} The document object
 */
function documentOf(responseData) {
    return new JSDOM(responseData).window.document;
}

/**
 * Returns a field that is not undefined.
 * @param field{any} The field
 * @param fieldName{string} The name of the field
 */
function getSafeField(field, fieldName) {
    if (field === undefined) throw new DataException(`Required field '${fieldName}' is missing in the payload!`);
    return field;
}
/**
 * Returns a value of field or a default value
 * @param field{string | undefined} The field value, can be undefined
 * @param fieldName{string} The name of the field for error messages
 * @param defaultValue{string|null} The default value, if it's null, the field is required
 * @returns {string} The final value of the field
 */
function getSafeStringField(field, fieldName, defaultValue = null) {
    if (defaultValue === null && field === undefined) throw new DataException(`Required string field '${fieldName}' is missing in the payload!`);
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

/**
 * Returns the content type
 * @param headers{Headers}
 */
function getContentType(headers) {
    const contentTypeHeader = headers["content-type"];
    if (contentTypeHeader === undefined) throw new ClientException("Request has no Content-Type header!");
    return contentTypeHeader.split(";")[0];
}

module.exports = {
    getCookie,
    documentOf,
    getSafeField,
    getSafeNumberField,
    getSafeBooleanField,
    getSafeStringField,
    getContentType
}