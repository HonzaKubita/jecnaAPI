function tokenFromHeader(req, res, next) {
    const token = req.headers["token"];
    if (token !== undefined && req.body !== undefined) {
        req.body.token = token;
    }
    next();
}
function queryToBody(req, res, next) {
    if (req.query !== undefined) {
        if (req.body === undefined) req.body = req.query;
        else req.body = { ...req.body, ...req.query};
        req.headers["content-type"] = "application/json";
    }
    next();
}

module.exports = {
    tokenFromHeader,
    queryToBody
}