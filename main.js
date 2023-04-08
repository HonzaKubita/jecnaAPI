require('express-async-errors');

const express = require('express');
const autoRestAPI = require('autorestapi');
const {constants} = require('./modules/constants');
const exceptionHandler = require('./exceptions/exceptionHandler');

const server = express();
server.use(express.json()); // Parse json body

autoRestAPI(server); // Register endpoints with autoRestAPI

server.use(exceptionHandler); // Exception handling

server.listen(constants.server.port, () => { // Start the server
    console.log(`Server running on port ${constants.server.port}!`);
});