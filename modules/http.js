const axios = require("axios");
const {constants} = require("./constants");

const jecnaAxios = axios.create({
    baseURL: constants.jecna.baseURL
})
const foodAxios = axios.create({
    baseURL: constants.food.baseURL
});

/**
 * This method sends reqest to the jecna server with options
 * @param options Axios options
 * @returns {Promise<axios.AxiosResponse<any>>} The server response
 */
async function request(options) {
    return jecnaAxios({
        validateStatus: () => true,
        ...options
    });
}
/**
 * This method sends GET request to the jecna server with path and token
 * @param path The path where to send the request to
 * @param token The JSESSIONID token
 * @param cookies Optional: more cookies to send
 * @param headers Optional: more headers to send
 * @param options Optional: more axios options to send
 * @param method Optional: the http method to use (=GET)
 * @returns {Promise<axios.AxiosResponse<*>>} The server response
 */
async function authRequest(path, token, cookies = "", headers = {}, options = {}, method = "GET") {
    return await request({
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
 * This method sends request to the food server with options
 * @param options Axios options
 * @returns {Promise<axios.AxiosResponse<any>>} The server response
 */
async function foodRequest(options) {
    return await foodAxios({
        validateStatus: () => true,
        ...options
    });
}

/**
 * This method sends GET request to the food server with path, session and token
 * @param path The path where to send the request to
 * @param session The JSESSIONID token
 * @param token The XSRF-TOKEN token
 * @param cookies Optional: more cookies to send
 * @param headers Optional: more headers to send
 * @param options Optional: more axios options to send
 * @param method Optional: the http method to use (=GET)
 * @returns {Promise<axios.AxiosResponse<*>>}
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
    request,
    authRequest,
    foodRequest,
    foodAuthRequest
}