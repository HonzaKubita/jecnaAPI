const {tokenValid, payloadIsType} = require("../../../modules/checker");
const {constants} = require("../../../modules/constants");
const {jecnaAuthRequest} = require("../../../modules/http");
const {newsParser} = require("../../../parsers/school/newsParser");
const {getSafeStringField} = require("../../../modules/utils");
module.exports = {
    get: async (req, res, next) => {
        payloadIsType(req.headers);

        const token = getSafeStringField(req.body.token, "token", constants.jecna.wrongToken);

        const newsRes = await jecnaAuthRequest("/akce", token);
        if (req.body.token !== undefined) tokenValid(newsRes.data);

        const newsJSON = newsParser(newsRes.data);
        res.status(200).json(newsJSON);
        next();
    }
}