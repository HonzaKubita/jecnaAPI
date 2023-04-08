const ServerException=  require("../exceptions/server/serverException");
const {JSDOM} = require("jsdom");

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
 * Returns if the user is logged in based on the jecna server response
 * @param htmlBody{string} The response
 * @returns {boolean} If the user is logged in
 */
function userLoggedIn(htmlBody) {
    return documentOf(htmlBody).getElementsByClassName("user-menu").length !== 0;
}

module.exports = {
    getCookie,
    documentOf,
    userLoggedIn
}