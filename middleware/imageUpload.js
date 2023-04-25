const multer = require("multer");
const {PayloadException} = require("../exceptions/client/payloadException");
const imageUpload = multer({
    preservePath: true,
    limits: {
        fileSize: 10485760,
        files: 1
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype !== "image/jpeg") {
            cb(new PayloadException("Image is not in JPEG format!", 415));
            return;
        }
        cb(null, true);
    },
    storage: multer.memoryStorage()
});

module.exports = {
    imageUpload
};