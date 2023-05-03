require("express-async-errors");
require('dotenv').config({
    path: `${__dirname}/.env`
});

const express = require("express");
const autoRestAPI = require("autorestapi");
const exceptionHandler = require("./exceptions/exceptionHandler");
const logger = require("./modules/logger");
const methodSelection = require("./api/index");
const {queryToBody, delEmptyData} = require("./middleware/parser");
const {tttInit} = require("./modules/ttt");

tttInit();

const server = express();
server.use(logger.setupMiddleware);
server.use(express.static(`${__dirname}/static`));
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

server.listen(process.env.PORT, () => { // Start the server
    logger.info(`Server running on port ${process.env.PORT}!`);
});