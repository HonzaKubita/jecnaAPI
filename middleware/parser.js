function queryToBody(req, res, next) {
    if (req.method === "GET")
        req.body = req.query;
    else delete req.query;

    next();
}

module.exports = {
    queryToBody
}