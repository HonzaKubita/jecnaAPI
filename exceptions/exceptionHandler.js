const PayloadException = require("./client/payloadException");
const {MulterError} = require("multer");
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
    console.error(err);
    res.status(500).json({
        type: INTERNAL_EXCEPTION,
        tree: INTERNAL_EXCEPTION,
        message: `An undocumented exception happened, please report this on github issues. Error: ${err}`
    });
}