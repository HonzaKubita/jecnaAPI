const axios = require('axios');

const BASE_URL = 'https://www.spsejecna.cz';

const axiosInstance = axios.create({
  baseURL: BASE_URL
});

async function request(options) {
  let result;
  try {
    result = await axiosInstance(options);
  }
  catch (e) {
    console.log(e);
  }
  return result;
}

async function authRequest(path, token, options={}) {
  let result;

  try {
    result = await axiosInstance({
      method: 'GET',
      url: path,
      headers: {
        "Cookie": `JSESSIONID=${token}`
      },
      ...options
    });
  }
  catch (e) {
    console.log(e);
  }
  return result;
}

module.exports = {
  request,
  authRequest,
  BASE_URL
}