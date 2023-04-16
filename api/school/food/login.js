const {payloadIsType} = require("../../../modules/checker");
const {foodRequest, foodDataPost} = require("../../../modules/http");
const {getCookie, getSafeStringField} = require("../../../modules/utils");
const {constants} = require("../../../modules/constants");
const LoginException = require("../../../exceptions/client/loginException");
module.exports = {
    post: async (req, res) => {
        payloadIsType(req.headers);

        const username = getSafeStringField(req.body.username, "username");
        const password = getSafeStringField(req.body.password, "password");

        const foodBaseRes = await foodRequest({
            method: "GET",
            url: "/faces/login.jsp"
        });

        let session = getCookie(constants.food.sessionCookieName, foodBaseRes.headers);
        const token = getCookie(constants.food.tokenCookieName, foodBaseRes.headers);

        const foodLoginRes = await foodDataPost("/j_spring_security_check", session, token, {
            j_username: username,
            j_password: password,
            _csrf: token
        }, "", {}, {
            maxRedirects: 0
        });

        if (foodLoginRes.headers["location"].includes("login_error")) {
            throw new LoginException("Wrong credentials!");
        }

        session = getCookie(constants.food.sessionCookieName, foodLoginRes.headers);

        res.status(200).json({
            session: session
        });
    }
}