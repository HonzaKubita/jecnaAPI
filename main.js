const express = require('express');
const autoRestAPI = require('autorestapi');
const {constants} = require("./modules/constants");
const exceptionHandler = require("./exceptions/exceptionHandler");

const app = express();
app.use(express.json()); // Parse json body
app.use(exceptionHandler); // Exception handling

autoRestAPI(app); // Register endpoints with autoRestAPI

app.listen(constants.server.port, () => { // Start the server
    console.log(`Server running on port ${constants.server.port}!`);
});