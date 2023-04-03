const { JSDOM } = require("jsdom");
const { request } = require("../modules/http");

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
      }
    });

    // Parse headers to extract JSESSIONID
    const JSESSIONID = resIndex.headers["set-cookie"]
      . find(cookie => cookie.includes("JSESSIONID"))
      ?.match(new RegExp(`^JSESSIONID=(.+?);`))
      ?.[1];

    // Extract token3 from login form
    const token3 = new JSDOM(resIndex.data).window.document.getElementById("loginForm").children[0].value;

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
        "Cookie": `JSESSIONID=${JSESSIONID}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: loginData,
    });

    // Check if login was successful
    const resLoginDOM = new JSDOM(resLogin.data);

    // Search for div with class "user-menu" as it appears only when user is logged in successfully
    if(resLoginDOM.window.document.getElementsByClassName("user-menu")){
      res.status(200).send(JSESSIONID);
    } else {
      res.status(401).send(`Bad credentials!`);
      return;
    }

  }
}