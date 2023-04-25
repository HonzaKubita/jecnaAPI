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


async function jecnaRequest(options) {
    return jecnaAxios({
        validateStatus: () => true,
        ...options
    });
}

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


async function jecnaDataPost(path, token, data, contentType = "application/x-www-form-urlencoded", cookies = "", headers = {}, options = {}) {
    return await jecnaAuthRequest(path, token, cookies, {
        "Content-Type": contentType,
        ... headers
    }, {
        data: data,
        ...options
    }, "POST");
}


async function foodRequest(options) {
    return await foodAxios({
        validateStatus: () => true,
        ...options
    });
}


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

async function foodDataPost(path, session, token, data, cookies = "", headers = {}, options = {}) {
    return await foodAuthRequest(path, session, token, cookies, {
        "Content-Type": "application/x-www-form-urlencoded",
        ... headers
    }, {
        data: data,
        ...options
    }, "POST");
}


async function moodleRequest(options) {
    return moodleAxios({
        validateStatus: () => true,
        ...options
    });
}

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