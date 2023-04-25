const {payloadIsJSON} = require("../../../modules/checker");
const {moodleRequest, moodleDataPost} = require("../../../modules/http");
const {getCookie, documentOf, getSafeStringField} = require("../../../modules/utils");
const {constants} = require("../../../modules/constants");
const {LoginException} = require("../../../exceptions/client/loginException");
module.exports = {
    post: async (req, res, next) => {
        payloadIsJSON(req.headers);

        const username = getSafeStringField(req.body.username, "username");
        const password = getSafeStringField(req.body.password, "password");

        const moodleBaseRes = await moodleRequest({
            method: "GET",
            url: "/login/index.php"
        });

        let session = getCookie(constants.moodle.sessionCookieName, moodleBaseRes.headers);
        const loginToken = documentOf(moodleBaseRes.data)
            .getElementById("login") // loginForm
            .children[0] // tokenInput
            .value;

        const moodleLoginRes = await moodleDataPost("/login/index.php", session, {
            logintoken: loginToken,
            username: username,
            password: password
        }, undefined, "", {}, {
            maxRedirects: 0
        });

        if (moodleLoginRes.headers["location"]==="https://moodle.spsejecna.cz/login/index.php") {
            throw new LoginException("Wrong credentials!");
        }

        session = getCookie(constants.moodle.sessionCookieName, moodleLoginRes.headers);
        const id = getCookie(constants.moodle.idCookieName, moodleLoginRes.headers);

        res.status(200).json({
            moodleSession: session,
            moodleId: id
        });
        next();
    }
}