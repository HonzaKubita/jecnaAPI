const {tokenValid} = require("../../../modules/checker");
const {getToken} = require("../../../modules/utils");
const {jecnaAuthRequest} = require("../../../modules/http");
const {profileEditParser} = require("../../../parsers/user/profileParser");
module.exports = {
    get: async (req, res, next) => {
        const token = getToken(req);

        const profileEditRes = await jecnaAuthRequest("/user-student/self-update", token);
        tokenValid(profileEditRes.data);

        const profileEditJSON = profileEditParser(profileEditRes.data);
        res.status(200).json(profileEditJSON);
        next();
    }
};