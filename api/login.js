const {getSafeField} = require('../modules/checker');
const {jecnaRequest, jecnaDataPost} = require('../modules/http');
const {constants} = require('../modules/constants');
const {getCookie, documentOf} = require('../modules/utils');
const LoginException = require('../exceptions/client/loginException');
module.exports = {
    post: async (req, res) => {
        const username = getSafeField(req.body.username, "username");
        const password = getSafeField(req.body.password, "password");

        const loginBaseRes = await jecnaRequest({
            method: "GET",
            url: "/",
            headers: {
                "Cookie": "WTDGUID=10"
            }
        });

        const session = getCookie(constants.jecna.sessionCookieName, loginBaseRes.headers);
        const token3 = documentOf(loginBaseRes.data).getElementById("loginForm").children[0].value;

        const loginRes = await jecnaDataPost("/user/login", session, {
            token3: token3,
            user: username,
            pass: password
        });

        if (documentOf(loginRes.data).getElementsByClassName("user-menu").length === 0)
            throw new LoginException("Wrong credentials!");

        res.status(200).json({
            token: session
        });
    }
}