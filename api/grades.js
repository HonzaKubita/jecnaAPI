const { authRequest } = require('../modules/http');
const gradesParser = require("../parsers/grades");

module.exports = {
  post: async (req, res) => {
    /*
      Endpoint for receiving grades

      Request must contain json body containing token you received from /login:
      {
        "token": "token_from_login"
      }

      Request will return json containing the grades in the following format:
      {
        "subjectName": {
          "subsection": [
            {
              "grade": 1,
              "description": "description",
              "date": "date",
              "teacher": "teachersName"
            },
            ...
          ],
          ...
        },
        ...
      }
    */
    
    // Request html with grades
    const resGrades = await authRequest('/score/student', req.body.token);

    try {
      const parsedGradesJSON = gradesParser(resGrades.data);
      res.status(200).send(JSON.stringify(parsedGradesJSON));
    }
    catch (e) {
      console.log(e);
      if (e.isParserException) {
        res.status(400).send(e.message);
      } else {
        res.status(500).send(`
          <b>Internal Server Error. Please report this at <a href="https://github.com/HonzaKubita/jecnaAPI/issues">Github Issues</a></b>
          <p>Error:</p>
          <p>${e}</p>
        `);
      }
    }
  }
}