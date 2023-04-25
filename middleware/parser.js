const {objectIsEmpty} = require("../modules/utils");

function queryToBody(req, res, next) {
    if (req.method === "GET")
        req.body = req.query;
    else delete req.query;

    next();
}

function delEmptyData(req, res, next) {
    if (objectIsEmpty(req.body))
        delete req.body;

    next();
}

module.exports = {
    queryToBody,
    delEmptyData
};