const express = require('express');
const autoRestAPI = require('autorestapi');
const exceptionHandler = require('./exceptions/exceptionHandler');

const PORT = 3000;

const app = express();
app.use(express.json()); // Parse json body

autoRestAPI(app); // Register endpoints with autoRestAPI

app.use(exceptionHandler); // Exception handling

app.listen(PORT, () => { // Start the server
  console.log(`Server running on port ${PORT}!`);
});