const {tokenValid, siteFound} = require("../../modules/checker");
const {getSafeStringField, getSafeNumberField, getToken} = require("../../modules/utils");
const {jecnaAuthRequest} = require("../../modules/http");
const {roomParser} = require("../../parsers/school/roomParser");
module.exports = {
    get: async (req, res, next) => {
        const token = getToken(req, true);
        const short = getSafeStringField(req.body?.short, "short");
        const year = getSafeNumberField(req.body?.year, "year", -1);
        const period = getSafeNumberField(req.body?.period, "period", -1);

        const roomRes = await jecnaAuthRequest(`/ucebna/${short}`, token);
        tokenValid(roomRes.data);
        siteFound(roomRes.data, `Room '${short}'`);

        const roomJSON = await roomParser(roomRes.data, year, period, token);
        res.status(200).json(roomJSON);
        next();
    }
};