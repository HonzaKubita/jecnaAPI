const { JSDOM } = require("jsdom");
const { request } = require("../modules/http");
const { encrypt } = require("../modules/auth");

module.exports = {
  post: async (req, res) => {
    /*
      Endpoint for logging in
      Request must contain json body containing user password and username in following format:
      {
        "username": "username",
        "password": "password"
      }
    */

    // Get page with login form + acquire JSESSIONID
    const resIndex = await request({
      method: 'GET',
      url: '/',
      headers: {
        "Cookie": "WTDGUID=10",
        "User-Agent": "Mozilla/5.0"
      }
    });

    // Parse headers to extract JSESSIONID
    const resIndexCookies = resIndex.headers['set-cookie'][0];
    const JSESSIONID = resIndexCookies.substring(resIndexCookies.indexOf("JSESSIONID="), resIndexCookies.indexOf(";", resIndexCookies.indexOf("JSESSIONID=")));

    // Extract token3 from login form
    const indexDom = new JSDOM(resIndex.data);
    const token3 = indexDom.window.document.getElementById("loginForm").children[0].value;

    console.log(`"${JSESSIONID}"`);
    console.log(`"${token3}"`);

    // Build body for login request
    const loginData = new URLSearchParams({
      token3: token3,
      user: req.body.username,
      pass: req.body.password,
    }).toString();

    // Login with credentials and JSESSIONID
    const resLogin = await request({
      method: 'POST',
      url: '/user/login',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cookie": `${JSESSIONID}; WTDGUID=10`,
        "User-Agent": "Mozilla/5.0"
      },
      data: loginData,
    });

    res.send(resLogin.data);

    // Check if login was successful
    // if(resLogin.status != 302){
    //   res.status(401).send(`Bad credentials!, status: ${resLogin.status}`);
    //   return;
    // } else {
    //   res.status(200).send(encrypt(JSESSIONID));
    // }

  }
}