const axios = require('axios');

const BASE_URL = 'https://spsejecna.cz';

const axiosInstance = axios.create({
  baseURL: BASE_URL
});

module.exports.request = async (options) => {
  let res;
  try {
    res = await axiosInstance(options);
  }
  catch (e) {
    console.log(e);
  }
  finally {
    return res;
  }
}