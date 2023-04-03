const express = require('express');
const autoRestAPI = require('autorestapi');

const app = express();

app.use(express.json());

autoRestAPI(app);

app.listen(3000, () => {
  console.log('Server running on port 3000!');
});