const {payloadIsJSON, userLoggedIn} = require("../modules/checker");
const {jecnaAuthRequest} = require("../modules/http");
const {getToken} = require("../modules/utils");
module.exports = {
    post: async (req, res, next) => {
        payloadIsJSON(req.headers);

        const token = getToken(req);

        const baseRes = await jecnaAuthRequest("/", token);

        res.status(200).json({
            valid: userLoggedIn(baseRes.data)
        });
        next();
    }
}