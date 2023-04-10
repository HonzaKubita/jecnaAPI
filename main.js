require("express-async-errors");

const express = require("express");
const multer = require("multer");
const autoRestAPI = require("autorestapi");
const {constants} = require("./modules/constants");
const exceptionHandler = require("./exceptions/exceptionHandler");
const PayloadException = require("./exceptions/client/payloadException");
const profileImageRoute = require("./api/user/profile/$image");

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

const server = express();
server.use(express.json()); // Parse json body

autoRestAPI(server); // Register endpoints with autoRestAPI
server.put("/user/profile/image", imageUpload.single("image"), profileImageRoute.put);
server.delete("/user/profile/image", profileImageRoute.delete);
server.post("/user/profile/image", profileImageRoute.post);

server.use(exceptionHandler); // Exception handling

server.listen(constants.server.port, () => { // Start the server
    console.log(`Server running on port ${constants.server.port}!`);
});