const {payloadIsType, tokenValid, siteFound} = require("../../modules/checker");
const {getSafeStringField, getSafeNumberField} = require("../../modules/utils");
const {constants} = require("../../modules/constants");
const {jecnaAuthRequest} = require("../../modules/http");
const {eventParser} = require("../../parsers/school/eventParser");
module.exports = {
    post: async (req, res) => {
        payloadIsType(req.headers);

        const token = getSafeStringField(req.body.token, "token", constants.jecna.wrongToken);
        const eventCode = getSafeNumberField(req.body.eventCode, "eventCode");

        const eventRes = await jecnaAuthRequest(`/akce/${eventCode}`, token);
        if (req.body.token !== undefined) tokenValid(eventRes.data);
        siteFound(eventRes.data, `Event ${eventCode}`);

        const eventJSON = eventParser(eventRes.data);
        res.status(200).json(eventJSON);
    }
}