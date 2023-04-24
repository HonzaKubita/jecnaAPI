const {payloadIsType, tokenValid} = require("../../modules/checker");
const {getSafeStringField, getSafeBooleanField, getSafeNumberField} = require("../../modules/utils");
const {jecnaAuthRequest} = require("../../modules/http");
const {recordListExpandParser, recordListParser} = require("../../parsers/user/recordListParser");
module.exports = {
    get: async (req, res, next) => {
        payloadIsType(req.headers);

        const token = getSafeStringField(req.body.token, "token");
        const expand = getSafeBooleanField(req.body.expand, "expand", false);
        const index = getSafeNumberField(req.body.index, "index", 0);
        const max = getSafeNumberField(req.body.max, "max", Infinity);

        const recordListRes = await jecnaAuthRequest("/user-student/record-list", token);
        tokenValid(recordListRes.data);

        const recordListJSON = expand ? await recordListExpandParser(recordListRes.data, index, max, token) : recordListParser(recordListRes.data, index, max);
        res.status(200).json(recordListJSON);
        next();
    }
}