const {authRequest} = require("../../modules/http");
const teachersParser = require("../../parsers/teachers");

module.exports = {
    post: async (req, res) => {
        /*
      Endpoint for getting teacher list
      Request must contain json body containing token you received from /login and the shortcut of the teacher you want to get
      {
      "token": "token"
      }
      Request will return json containing the list of all teachers in this format:
      {
      "teachers": [
      {
        "name": "cele jmeno citele",
        "short": "zkratka ucitele"
      }
      ]
      }
    */

        const resTeachers = await authRequest("/ucitel", req.body.token); // getting the teacher list

        try {
            const teachersJSON = teachersParser(resTeachers.data);
            res.status(200).send(JSON.stringify(teachersJSON));
        }
        catch (ex) {
            console.log(ex);
            if (ex.isParserException) res.status(400).send(ex.message);
            else res.status(500); // FIXME it's just temporarily
        }
    }
}