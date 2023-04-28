const {userLoggedIn} = require("../modules/checker");
const {jecnaAuthRequest} = require("../modules/http");
const {getToken} = require("../modules/utils");
module.exports = {
    get: async (req, res, next) => {
        const token = getToken(req, true);

        const baseRes = await jecnaAuthRequest("/", token);

        res.status(200).json({
            valid: userLoggedIn(baseRes.data)
        });
        next();
    }
};