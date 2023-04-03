const express = require('express');
const autoRestAPI = require('autorestapi');

const PORT = 3000;

const app = express();
app.use(express.json());

autoRestAPI(app);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}!`);
});