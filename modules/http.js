const axios = require('axios');

const BASE_URL = 'https://www.spsejecna.cz/';

const axiosInstance = axios.create({
  baseURL: BASE_URL
});

module.exports.request = async (options) => {
  let result;
  try {
    result = await axiosInstance(options);
  }
  catch (e) {
    console.log(e);
  }
  return result;
}