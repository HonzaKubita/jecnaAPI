const {tokenValid, siteFound} = require("../../modules/checker");
const {getSafeNumberField, getToken} = require("../../modules/utils");

const {jecnaAuthRequest} = require("../../modules/http");
const {eventParser} = require("../../parsers/school/eventParser");
module.exports = {
    get: async (req, res, next) => {
        const token = getToken(req);
        const eventCode = getSafeNumberField(req.body.eventCode, "eventCode");

        const eventRes = await jecnaAuthRequest(`/akce/${eventCode}`, token);
        if (req.token !== undefined) tokenValid(eventRes.data);
        siteFound(eventRes.data, `Event ${eventCode}`);

        const eventJSON = eventParser(eventRes.data);
        res.status(200).json(eventJSON);
        next();
    }
};