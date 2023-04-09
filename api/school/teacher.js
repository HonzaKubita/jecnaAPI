const {payloadIsType, tokenValid, siteFound} = require("../../modules/checker");
const {getSafeStringField, getSafeNumberField} = require("../../modules/utils");
const {constants} = require("../../modules/constants");
const {jecnaAuthRequest} = require("../../modules/http");
const {teacherParser} = require("../../parsers/school/teacherParser");
module.exports = {
    post: async (req, res) => {
        payloadIsType(req.headers);

        const token = getSafeStringField(req.body.token, "token", constants.jecna.wrongToken);
        const short = getSafeStringField(req.body.short, "short");
        const year = getSafeNumberField(req.body.year, "year", -1);
        const period = getSafeNumberField(req.body.period, "period", -1);

        const teacherRes = await jecnaAuthRequest(`/ucitel/${short}`, token);
        if (req.body.token !== undefined) tokenValid(teacherRes.data);
        siteFound(teacherRes.data, `Teacher '${short}'`);

        const teacherJSON = await teacherParser(teacherRes.data, year, period, token);
        res.status(200).json(teacherJSON);
    }
}