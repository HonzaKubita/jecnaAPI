const {payloadIsJSON} = require("../modules/checker");
const {jecnaAuthRequest} = require("../modules/http");
const {getToken} = require("../modules/utils");
module.exports = {
    post: async (req, res, next) => {
        payloadIsJSON(req.headers);

        const token = getToken(req);
        await jecnaAuthRequest("/user/logout", token);
        res.status(200).send();
        next();
    }
}