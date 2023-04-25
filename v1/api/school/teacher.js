const {tokenValid, siteFound} = require("../../modules/checker");
const {getSafeStringField, getSafeNumberField, getToken} = require("../../modules/utils");

const {jecnaAuthRequest} = require("../../modules/http");
const {teacherParser} = require("../../parsers/school/teacherParser");
module.exports = {
    get: async (req, res, next) => {
        const token = getToken(req);
        const short = getSafeStringField(req.body.short, "short");
        const year = getSafeNumberField(req.body.year, "year", -1);
        const period = getSafeNumberField(req.body.period, "period", -1);

        const teacherRes = await jecnaAuthRequest(`/ucitel/${short}`, token);
        if (req.token !== undefined) tokenValid(teacherRes.data);
        siteFound(teacherRes.data, `Teacher '${short}'`);

        const teacherJSON = await teacherParser(teacherRes.data, year, period, token);
        res.status(200).json(teacherJSON);
        next();
    }
};