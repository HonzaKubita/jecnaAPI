const {PayloadException} = require("./client/payloadException");
const {MulterError} = require("multer");
const {ServerException} = require("./server/serverException");
const {JecnaException} = require("./jecnaException");
const INTERNAL_EXCEPTION = "internalException";

module.exports = (err, req, res, next) => {
    if (err instanceof SyntaxError) {
        err = new PayloadException(`Wrong json format: ${err.message}`);
    }
    if (err instanceof MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") err = new PayloadException("Image is too large!", 413);
        if (err.code === "LIMIT_FILE_COUNT") err = new PayloadException("You can send only one file!", 413);
        if (err.code === "LIMIT_UNEXPECTED_FILE") err = new PayloadException("Unexpected file! Please use field name as it is in documentation.");
    }
    // check if the exception is custom
    if (err instanceof JecnaException) {
        if (err instanceof ServerException) err.exitCode = 1;
        res.status(err.code).json({
            type: err.name,
            tree: err.tree,
            message: err.message,
            // only for some errors
            errors: err.errors
        });
    } else { // if it is not custom, throw an internal exception
        err.exitCode = 1;
        res.status(500).json({
            type: INTERNAL_EXCEPTION,
            tree: INTERNAL_EXCEPTION,
            message: `An undocumented exception happened, please report this on github issues. (see console for more details)`
        });
    }
    if (req.logger === undefined) throw err;
    req.logger.err = err;
    next();
};