const {tokenValid} = require("../../modules/checker");
const {getSafeNumberField, getToken} = require("../../modules/utils");
const {jecnaAuthRequest} = require("../../modules/http");
const {gradesParser} = require("../../parsers/user/gradesParser");
module.exports = {
    get: async (req, res, next) => {
        const token = getToken(req, true);
        const year = getSafeNumberField(req.body.year, "year", -1);
        const halfTerm = getSafeNumberField(req.body.halfTerm, "halfTerm", -1);

        const gradesLink =
            "/score/student" +
            (year !== -1 || halfTerm !== -1 ? "?" : "") +
            (year !== -1 ? `schoolYearId=${year}` : "") +
            (year !== -1 && halfTerm !== -1 ? "&" : "") +
            (halfTerm !== -1 ? `schoolYearHalfId=${halfTerm}` : "");

        const gradesRes = await jecnaAuthRequest(gradesLink, token);
        tokenValid(gradesRes.data);


        const gradesJSON = gradesParser(gradesRes.data);
        res.status(200).json(gradesJSON);
        next();
    }
};