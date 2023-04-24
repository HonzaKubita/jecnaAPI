const {payloadIsType, tokenValid, siteFound} = require("../../modules/checker");
const {getSafeStringField, getSafeNumberField} = require("../../modules/utils");
const {jecnaAuthRequest} = require("../../modules/http");
const {parseSchedule} = require("../../parsers/user/scheduleParser");
module.exports = {
    get: async (req, res, next) => {
        payloadIsType(req.headers);

        const token = getSafeStringField(req.body.token, "token");
        const year = getSafeNumberField(req.body.year, "year", -1);
        const period = getSafeNumberField(req.body.period, "period", -1);

        const scheduleLink =
            "/timetable/class" +
            (year !== -1 || period !== -1 ? "?" : "") +
            (year !== -1 ? `schoolYearId=${year}` : "") +
            (year !== -1 && period !== -1 ? "&" : "") +
            (period !== -1 ? `timetableId=${period}` : "");
        const scheduleRes = await jecnaAuthRequest(scheduleLink, token);
        tokenValid(scheduleRes.data);
        siteFound(scheduleRes.data, `${year !== -1 ? `Year ${year}` : ""}${year !== -1 && period !== -1 ? " or " : ""}${period !== -1 ? `Period ${period}` : ""}`);

        const scheduleJSON = parseSchedule(scheduleRes.data);
        res.status(200).json(scheduleJSON);
        next();
    }
}