const {payloadIsType, tokenValid} = require("../../../modules/checker");
const {constants} = require("../../../modules/constants");
const {jecnaAuthRequest} = require("../../../modules/http");
const {getSafeBooleanField, getSafeStringField, getSafeNumberField} = require("../../../modules/utils");
const {archiveExpandParser, archiveParser} = require("../../../parsers/school/newsParser");
module.exports = {
    post: async (req, res, next) => {
        payloadIsType(req.headers);

        const token = getSafeStringField(req.body.token, "token", constants.jecna.wrongToken);
        const expand = getSafeBooleanField(req.body.expand, "expand", false);
        const index = getSafeNumberField(req.body.index, "index", 0);
        const max = getSafeNumberField(req.body.max, "max", Infinity);

        const archiveRes = await jecnaAuthRequest("/akce/archiv", token);
        if (req.body.token !== undefined) tokenValid(archiveRes.data);

        const archiveJSON = expand ? await archiveExpandParser(archiveRes.data, token, index, max) : archiveParser(archiveRes.data, index, max);
        res.status(200).json(archiveJSON);
        next();
    }
}