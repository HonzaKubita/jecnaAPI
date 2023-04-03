const express = require('express');
const autoRestAPI = require('autorestapi');

const app = express();

app.use(express.json({extended: true, limit: '1mb'}));

autoRestAPI(app);

app.listen(3000, () => {
  console.log('Server running on port 3000!');
});