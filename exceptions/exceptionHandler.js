const PayloadException = require("./client/payloadException");
const INTERNAL_EXCEPTION = "internalException";

module.exports = (err, req, res, next) => {
    //console.log(err);
    if (err instanceof SyntaxError) {
        err = new PayloadException(`Wrong json format: ${err.message}`);
    }
    // check if the exception is custom
    if (err.isCustom) {
        res.status(err.code).json({
            type: err.type,
            tree: err.tree,
            message: err.message
        });
        return;
    }
    // if it is not custom, throw an internal exception
    console.error(err);
    res.status(500).json({
        type: INTERNAL_EXCEPTION,
        tree: INTERNAL_EXCEPTION,
        message: `An undocumented exception happened, please report this on github issues. Error: ${err}`
    });
}