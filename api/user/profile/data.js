const {payloadIsType, tokenValid} = require("../../../modules/checker");
const {getSafeStringField} = require("../../../modules/utils");
const {jecnaAuthRequest} = require("../../../modules/http");
const {profileEditParser} = require("../../../parsers/user/profileParser");
module.exports = {
    get: async (req, res, next) => {
        payloadIsType(req.headers);

        const token = getSafeStringField(req.body.token, "token");

        const profileEditRes = await jecnaAuthRequest("/user-student/self-update", token);
        tokenValid(profileEditRes.data);

        const profileEditJSON = profileEditParser(profileEditRes.data);
        res.status(200).json(profileEditJSON);
        next();
    }
}