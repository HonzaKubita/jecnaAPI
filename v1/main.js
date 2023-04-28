require("express-async-errors");

const express = require("express");
const autoRestAPI = require("autorestapi");
const {constants} = require("./modules/constants");
const exceptionHandler = require("./exceptions/exceptionHandler");
const logger = require("./modules/logger");
const methodSelection = require("./api/index");
const {queryToBody, delEmptyData} = require("./middleware/parser");
const {tttInit} = require("./modules/ttt");

tttInit();

const server = express();
server.use(logger.setupMiddleware);
server.use(express.json({
    limit: "5mb",
    verify(req, res, buf, encoding) {
        req.logger.rawData = buf.toString(encoding);
    }
})); // Parse json body
server.use(delEmptyData);
server.use(queryToBody);
server.use(logger.startMiddleware);

autoRestAPI(server); // Register endpoints with autoRestAPI
server.subscribe("/", methodSelection.subscribe);

server.use(exceptionHandler); // Exception handling
server.use(logger.endMiddleware);

server.listen(constants.server.port, () => { // Start the server
    logger.info(`Server running on port ${constants.server.port}!`);
});