const {payloadIsType, tokenValid, siteFound} = require("../../modules/checker");
const {getSafeStringField, getSafeNumberField} = require("../../modules/utils");
const {jecnaAuthRequest} = require("../../modules/http");
const {absenceParser} = require("../../parsers/user/absenceParser");
module.exports = {
    post: async (req, res, next) => {
        payloadIsType(req.headers);

        const token = getSafeStringField(req.body.token, "token");
        const year = getSafeNumberField(req.body.year, "year", -1);

        const absenceLink = `/absence/student${year === -1 ? "" : `?schoolYearId=${year}`}`;
        const absenceRes = await jecnaAuthRequest(absenceLink, token);
        tokenValid(absenceRes.data);
        siteFound(absenceRes.data, `Year ${year}`);

        const absenceJSON = absenceParser(absenceRes.data);
        res.status(200).json(absenceJSON);
        next();
    }
}