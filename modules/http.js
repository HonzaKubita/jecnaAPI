const axios = require("axios");
const {constants} = require("./constants");

const jecnaAxios = axios.create({
    baseURL: constants.jecna.baseURL
})
const foodAxios = axios.create({
    baseURL: constants.food.baseURL
});
const moodleAxios = axios.create({
    baseURL: constants.moodle.baseURL
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
/**
 * This method sends POST request to the moodle server with path, token and data (url form encoded)
 * @param path{string} The path where to send the request to
 * @param session{string} The JSESSIONID token
 * @param token{string} The XSRF-TOKEN token
 * @param data The data to send
 * @param cookies{string} Optional: more cookies to send
 * @param headers{AxiosHeaders} Optional: more headers to send
 * @param options{AxiosRequestConfig} Optional: more axios options to send
 * @returns {Promise<AxiosResponse<*>>} The server response
 */
async function foodDataPost(path, session, token, data, cookies = "", headers = {}, options = {}) {
    return await foodAuthRequest(path, session, token, cookies, {
        "Content-Type": "application/x-www-form-urlencoded",
        ... headers
    }, {
        data: data,
        ...options
    }, "POST");
}

/**
 * This method sends request to the moodle server with options
 * @param options{AxiosRequestConfig} Axios options
 * @returns {Promise<axios.AxiosResponse<any>>} The server response
 */
async function moodleRequest(options) {
    return moodleAxios({
        validateStatus: () => true,
        ...options
    });
}
/**
 * This method sends GET request to the moodle server with path and token
 * @param path{string} The path where to send the request to
 * @param token{string} The MoodleSession token
 * @param id{string|undefined} Optional: MOODLEID1_ token, if not provided it's not sent
 * @param cookies{string} Optional: more cookies to send
 * @param headers{AxiosHeaders} Optional: more headers to send
 * @param options{AxiosRequestConfig} Optional: more axios options to send
 * @param method{Method} Optional: the http method to use (=GET)
 * @returns {Promise<AxiosResponse<*>>} The server response
 */
async function moodleAuthRequest(path, token, id = undefined, cookies = "", headers = {}, options = {}, method = "GET") {
    let moodleIdCookie = id === undefined ? "" : `${constants.moodle.idCookieName}=${id}`;
    return await moodleRequest({
        method: method,
        url: path,
        headers: {
            "Cookie": `${constants.moodle.sessionCookieName}=${token}${moodleIdCookie}${cookies}`,
            ...headers
        },
        ...options
    });
}

/**
 * This method sends POST request to the moodle server with path, token and data (url form encoded)
 * @param path{string} The path where to send the request to
 * @param token{string} The JSESSIONID token
 * @param id{string|undefined} Optional: MOODLEID1_ token, if not provided it's not sent
 * @param data The data to send
 * @param cookies{string} Optional: more cookies to send
 * @param headers{AxiosHeaders} Optional: more headers to send
 * @param options{AxiosRequestConfig} Optional: more axios options to send
 * @returns {Promise<AxiosResponse<*>>} The server response
 */
async function moodleDataPost(path, token, data, id = undefined, cookies = "", headers = {}, options = {}) {
    return await moodleAuthRequest(path, token, id, cookies, {
        "Content-Type": "application/x-www-form-urlencoded",
        ... headers
    }, {
        data: data,
        ...options
    }, "POST");
}

module.exports = {
    jecnaRequest,
    jecnaAuthRequest,
    jecnaDataPost,
    foodRequest,
    foodAuthRequest,
    foodDataPost,
    moodleRequest,
    moodleAuthRequest,
    moodleDataPost
}