require("express-async-errors");

const express = require("express");
const autoRestAPI = require("autorestapi");
const {constants} = require("./modules/constants");
const exceptionHandler = require("./exceptions/exceptionHandler");
const {loggerInit, loggerStartMiddleware, loggerEndMiddleware, logger} = require("./modules/logger");
const {queryToBody, delEmptyData} = require("./middleware/parser");

loggerInit();

const server = express();
server.use(express.json()); // Parse json body
server.use(queryToBody);
server.use(delEmptyData);
server.use(loggerStartMiddleware);

autoRestAPI(server); // Register endpoints with autoRestAPI

server.use(exceptionHandler); // Exception handling
server.use(loggerEndMiddleware);

server.listen(constants.server.port, () => { // Start the server
    logger.info(`Server running on port ${constants.server.port}!`);
});