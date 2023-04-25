const {tokenValid} = require("../../../modules/checker");

const {jecnaAuthRequest} = require("../../../modules/http");
const {newsParser} = require("../../../parsers/school/newsParser");
const {getToken} = require("../../../modules/utils");
module.exports = {
    get: async (req, res, next) => {


        const token = getToken(req);

        const newsRes = await jecnaAuthRequest("/akce", token);
        if (req.body.token !== undefined) tokenValid(newsRes.data);

        const newsJSON = newsParser(newsRes.data);
        res.status(200).json(newsJSON);
        next();
    }
}