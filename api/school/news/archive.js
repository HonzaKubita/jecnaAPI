const {tokenValid} = require("../../../modules/checker");
const {jecnaAuthRequest} = require("../../../modules/http");
const {getSafeBooleanField, getSafeNumberField, getToken} = require("../../../modules/utils");
const {archiveExpandParser, archiveParser} = require("../../../parsers/school/newsParser");
module.exports = {
    get: async (req, res, next) => {
        const token = getToken(req);
        const expand = getSafeBooleanField(req.body?.expand, "expand", false);
        const index = getSafeNumberField(req.body?.index, "index", 0);
        const max = getSafeNumberField(req.body?.max, "max", Infinity);

        const archiveRes = await jecnaAuthRequest("/akce/archiv", token);
        if (req.token !== undefined) tokenValid(archiveRes.data);

        const archiveJSON = expand ? await archiveExpandParser(archiveRes.data, token, index, max) : archiveParser(archiveRes.data, index, max);
        res.status(200).json(archiveJSON);
        next();
    }
};