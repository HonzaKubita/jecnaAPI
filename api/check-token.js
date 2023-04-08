const {payloadIsType, getSafeField} = require("../modules/checker");
const {jecnaAuthRequest} = require("../modules/http");
const {userLoggedIn} = require("../modules/utils");
module.exports = {
    post: async (req, res) => {
        payloadIsType(req.headers);

        const token = getSafeField(req.body.token, "token");

        const baseRes = await jecnaAuthRequest("/", token);

        res.status(200).json({
            valid: userLoggedIn(baseRes.data)
        });
    }
}