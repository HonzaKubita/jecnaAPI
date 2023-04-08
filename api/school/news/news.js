const {getSafeField, tokenValid, payloadIsType} = require("../../../modules/checker");
const {constants} = require("../../../modules/constants");
const {jecnaAuthRequest} = require("../../../modules/http");
const {newsParser} = require("../../../parsers/school/newsParser");
module.exports = {
    post: async (req, res) => {
        payloadIsType(req.headers);

        const token = getSafeField(req.body.token, "token", constants.jecna.wrongToken);

        const newsRes = await jecnaAuthRequest("/akce", token);
        if (req.body.token !== undefined) tokenValid(newsRes.data);

        const newsJSON = newsParser(newsRes.data);

        res.status(200).send(newsJSON);
    }
}