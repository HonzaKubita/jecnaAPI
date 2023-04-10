const {payloadIsType, tokenValid} = require("../../modules/checker");
const {getSafeStringField, getSafeNumberField} = require("../../modules/utils");
const {jecnaAuthRequest} = require("../../modules/http");
const {gradesParser} = require("../../parsers/user/gradesParser");
module.exports = {
    post: async (req, res) => {
        payloadIsType(req.headers);

        const token = getSafeStringField(req.body.token, "token");
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
    }
}