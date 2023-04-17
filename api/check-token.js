const {payloadIsType, userLoggedIn} = require("../modules/checker");
const {jecnaAuthRequest} = require("../modules/http");
const {getSafeStringField} = require("../modules/utils");
module.exports = {
    post: async (req, res, next) => {
        payloadIsType(req.headers);

        const token = getSafeStringField(req.body.token, "token");

        const baseRes = await jecnaAuthRequest("/", token);

        res.status(200).json({
            valid: userLoggedIn(baseRes.data)
        });
        next();
    }
}