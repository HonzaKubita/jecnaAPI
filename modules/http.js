const axios = require("axios");
const {constants} = require("./constants");

const jecnaAxios = axios.create({
    baseURL: constants.jecna.baseURL
})
const foodAxios = axios.create({
    baseURL: constants.food.baseURL
});

/**
 * This method sends request to the jecna server with options
 * @param options{AxiosRequestConfig} Axios options
 * @returns {Promise<axios.AxiosResponse<any>>} The server response
 */
async function jecnaRequest(options) {
    return jecnaAxios({
        validateStatus: () => true,
        ...options
    });
}
/**
 * This method sends GET request to the jecna server with path and token
 * @param path{string} The path where to send the request to
 * @param token{string} The JSESSIONID token
 * @param cookies{string} Optional: more cookies to send
 * @param headers{AxiosHeaders} Optional: more headers to send
 * @param options{AxiosRequestConfig} Optional: more axios options to send
 * @param method{Method} Optional: the http method to use (=GET)
 * @returns {Promise<AxiosResponse<*>>} The server response
 */
async function jecnaAuthRequest(path, token, cookies = "", headers = {}, options = {}, method = "GET") {
    return await jecnaRequest({
        method: method,
        url: path,
        headers: {
            "Cookie": `${constants.jecna.sessionCookieName}=${token}${cookies}`,
            ...headers
        },
        ...options
    });
}

/**
 * This method sends POST request to the jecna server with path, token and data (url form encoded)
 * @param path{string} The path where to send the request to
 * @param token{string} The JSESSIONID token
 * @param data The data to send
 * @param cookies{string} Optional: more cookies to send
 * @param headers{AxiosHeaders} Optional: more headers to send
 * @param options{AxiosRequestConfig} Optional: more axios options to send
 * @returns {Promise<AxiosResponse<*>>} The server response
 */
async function jecnaDataPost(path, token, data, cookies = "", headers = {}, options = {}) {
    return await jecnaAuthRequest(path, token, cookies, {
        "Content-Type": "application/x-www-form-urlencoded",
        ... headers
    }, {
        data: data,
        ...options
    }, "POST");
}

/**
 * This method sends request to the food server with options
 * @param options{AxiosRequestConfig} Axios options
 * @returns {Promise<AxiosResponse<any>>} The server response
 */
async function foodRequest(options) {
    return await foodAxios({
        validateStatus: () => true,
        ...options
    });
}

/**
 * This method sends GET request to the food server with path, session and token
 * @param path{string} The path where to send the request to
 * @param session{string} The JSESSIONID token
 * @param token{string} The XSRF-TOKEN token
 * @param cookies{string} Optional: more cookies to send
 * @param headers{AxiosHeaders} Optional: more headers to send
 * @param options{AxiosRequestConfig} Optional: more axios options to send
 * @param method{Method} Optional: the http method to use (=GET)
 * @returns {Promise<AxiosResponse<*>>}
 */
async function foodAuthRequest(path, session, token, cookies = "", headers = {}, options = {}, method = "GET") {
    return foodRequest({
        method: method,
        url: path,
        headers: {
            "Cookie": `${constants.food.sessionCookieName}=${session}; ${constants.food.tokenCookieName}=${token}${cookies}`,
            ...headers
        },
        ...options
    });
}

module.exports = {
    jecnaRequest,
    jecnaAuthRequest,
    jecnaDataPost,
    foodRequest,
    foodAuthRequest
}