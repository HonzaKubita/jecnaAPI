const {tokenValid, siteFound} = require("../../modules/checker");
const {getSafeNumberField, getToken} = require("../../modules/utils");
const {jecnaAuthRequest} = require("../../modules/http");
const {absenceParser} = require("../../parsers/user/absenceParser");
module.exports = {
    get: async (req, res, next) => {
        const token = getToken(req, true);
        const year = getSafeNumberField(req.body?.year, "year", -1);

        const absenceLink = `/absence/student${year === -1 ? "" : `?schoolYearId=${year}`}`;
        const absenceRes = await jecnaAuthRequest(absenceLink, token);
        tokenValid(absenceRes.data);
        siteFound(absenceRes.data, `Year ${year}`);

        const absenceJSON = absenceParser(absenceRes.data);
        res.status(200).json(absenceJSON);
        next();
    }
};