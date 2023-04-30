const {ServerException} = require("../exceptions/server/serverException");
const {DataException} = require("../exceptions/client/dataException");
const {ClientException} = require("../exceptions/client/clientException");
const {parseHTML} = require("linkedom");
const {PayloadException} = require("../exceptions/client/payloadException");
const {constants} = require("./constants");

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

function documentOf(responseData) {
    return parseHTML(responseData).window.document;
}

function getToken(req, required = false, _default = constants.jecna.wrongToken) {
    const token = req.headers["token"];
    if (required && token === undefined)
        throw new PayloadException("Required header 'token' is missing in the request!");
    return req.headers["token"] ?? _default;
}

function getSafeField(field, fieldName) {
    if (field === undefined) throw new PayloadException(`Required field '${fieldName}' is missing in the payload!`);
    return field;
}

function getSafeStringField(field, fieldName, defaultValue = null) {
    if (defaultValue === null && field === undefined) throw new PayloadException(`Required string field '${fieldName}' is missing in the payload!`);
    return (field === undefined ? defaultValue : field).toString();
}

function getSafeNumberField(field, fieldName, defaultValue = null) {
    if (defaultValue === null && field === undefined) throw new PayloadException(`Required field '${fieldName}' is missing in the payload!`);
    const value = parseInt(field === undefined ? defaultValue : field);
    if (isNaN(value)) throw new DataException(`Field '${fieldName}' is not a number!`);
    return value;
}

function getSafeBooleanField(field, fieldName, defaultValue = null) {
    if (defaultValue === null && field === undefined) throw new PayloadException(`Required field '${fieldName}' is missing in the payload!`);
    const value = parseBoolean(field === undefined ? defaultValue.toString() : field);
    if (value === undefined) throw new DataException(`Field '${fieldName}' is not a boolean!`);
    return value;

}

function getContentType(headers) {
    const contentTypeHeader = headers["content-type"];
    if (contentTypeHeader === undefined) throw new ClientException("Request has no Content-Type header!");
    return contentTypeHeader.split(";")[0];
}

function parseBoolean(string) {
    if (/^(true|yes)$/.test(string)) return true;
    if (/^(false|no)$/.test(string)) return false;
    return undefined;
}

function objectIsEmpty(object) {
    return Object.keys(JSON.parse(JSON.stringify(object))).length === 0;
}

module.exports = {
    getCookie,
    documentOf,
    getSafeField,
    getSafeNumberField,
    getSafeBooleanField,
    getSafeStringField,
    getContentType,
    parseBoolean,
    objectIsEmpty,
    getToken
};