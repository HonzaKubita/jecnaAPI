const {payloadIsType, tokenValid} = require("../../../modules/checker");
const {getSafeStringField, documentOf} = require("../../../modules/utils");
const {jecnaAuthRequest} = require("../../../modules/http");
const {profileParser} = require("../../../parsers/user/profileParser");
module.exports = {
    get: async (req, res, next) => {
        payloadIsType(req.headers);

        const token = getSafeStringField(req.body.token, "token");

        const baseRes = await jecnaAuthRequest("/", token);
        tokenValid(baseRes.data);
        const profileLink = documentOf(baseRes.data)
            .getElementsByClassName("user-menu")[0] // profileDiv
            .children[1] // myProfileA
            .href;

        const profileRes = await jecnaAuthRequest(profileLink, token);

        const profileJSON = profileParser(profileRes.data, token);
        res.status(200).json(profileJSON);
        next();
    }
}