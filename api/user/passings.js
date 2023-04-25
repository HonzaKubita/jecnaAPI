const {tokenValid, siteFound} = require("../../modules/checker");
const {getSafeNumberField, getToken} = require("../../modules/utils");
const {jecnaAuthRequest} = require("../../modules/http");
const {passingsParser} = require("../../parsers/user/passingsParser");
module.exports = {
    get: async (req, res, next) => {


        const token = getToken(req);
        const year = getSafeNumberField(req.body.year, "year", -1);
        const month = getSafeNumberField(req.body.month, "month", -1);

        const passingsLink =
            "/absence/passing-student" +
            (year !== -1 || month !== -1 ? "?" : "") +
            (year !== -1 ? `schoolYearId=${year}` : "") +
            (year !== -1 && month !== -1 ? "&" : "") +
            (month !== -1 ? `schoolYearPartMonthId=${month}` : "");
        const passingsRes = await jecnaAuthRequest(passingsLink, token);
        tokenValid(passingsRes.data);
        siteFound(passingsRes.data, `${year !== -1 ? `Year ${year}` : ""}${year !== -1 && month !== -1 ? " or " : ""}${month !== -1 ? `Month ${month}` : ""}`);

        const passingsJSON = passingsParser(passingsRes.data);
        res.status(200).json(passingsJSON);
        next();
    }
}