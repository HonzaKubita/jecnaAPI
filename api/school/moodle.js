const {payloadIsType, getSafeField} = require("../../modules/checker");
const {moodleRequest, moodleDataPost} = require("../../modules/http");
const {getCookie, documentOf} = require("../../modules/utils");
const {constants} = require("../../modules/constants");
const LoginException = require("../../exceptions/client/loginException");
module.exports = {
    post: async (req, res) => {
        payloadIsType(req.headers);

        const username = getSafeField(req.body.username, "username");
        const password = getSafeField(req.body.password, "password");

        const moodleBaseRes = await moodleRequest({
            method: "GET",
            url: "/login/index.php"
        });

        let session = getCookie(constants.moodle.sessionCookieName, moodleBaseRes.headers);
        const loginToken = documentOf(moodleBaseRes.data)
            .getElementById("login") // loginForm
            .children[0] // tokenInput
            .value;

        const login1Res = await moodleDataPost("/login/index.php", session, {
            logintoken: loginToken,
            username: username,
            password: password
        }, undefined, "", {}, {
            maxRedirects: 0
        });

        if (login1Res.headers["location"]==="https://moodle.spsejecna.cz/login/index.php") {
            throw new LoginException("Wrong credentials!");
        }

        session = getCookie(constants.moodle.sessionCookieName, login1Res.headers);
        const id = getCookie(constants.moodle.idCookieName, login1Res.headers);

        res.status(200).json({
            moodleSession: session,
            moodleId: id
        });
    }
}