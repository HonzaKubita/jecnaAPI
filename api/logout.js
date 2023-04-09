const {payloadIsType} = require("../modules/checker");
const {jecnaAuthRequest} = require("../modules/http");
const {getSafeStringField} = require("../modules/utils");
module.exports = {
    post: async (req, res) => {
        payloadIsType(req.headers);

        const token = getSafeStringField(req.body.token, "token");
        await jecnaAuthRequest("/user/logout", token);
        res.status(200).json({});
    }
}