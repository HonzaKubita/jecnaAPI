const PayloadException = require("./client/payloadException");
const {MulterError} = require("multer");
const ServerException = require("./server/serverException");
const INTERNAL_EXCEPTION = "internalException";

module.exports = (err, req, res, next) => {
    //console.log(err);
    if (err instanceof SyntaxError) {
        err = new PayloadException(`Wrong json format: ${err.message}`);
    }
    if (err instanceof MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") err = new PayloadException("Image is too large!", 413);
        if (err.code === "LIMIT_FILE_COUNT") err = new PayloadException("You can send only one file!", 413);
    }
    // check if the exception is custom
    if (err.isCustom) {
        if (err instanceof ServerException) logError(err);
        res.status(err.code).json({
            type: err.type,
            tree: err.tree,
            message: err.message,
            // only for some errors
            errors: err.errors
        });
        return;
    }
    // if it is not custom, throw an internal exception
    logError(err);
    res.status(500).json({
        type: INTERNAL_EXCEPTION,
        tree: INTERNAL_EXCEPTION,
        message: `An undocumented exception happened, please report this on github issues. (see console for more details)`
    });
}

function logError(req, err) {
    console.error("An undocumented exception occurred!");
    console.error("================== REQUEST ==================");
    console.error(req);
    console.error("================= EXCEPTION =================");
    console.error(err);
}