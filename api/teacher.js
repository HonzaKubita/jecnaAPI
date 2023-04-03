const { authRequest } = require('../modules/http');
const teacherParser = require("../parsers/teacher")

module.exports = {
  post: async (req, res) => {
    /*
      Endpoint for getting teacher info
      Request must contain json body containing token you received from /login and the shortcut of the teacher you want to get
      {
      "token": "token",
      "teacherShort": "teacherShort"
      }
      Request will return json containing the teacher info in the following format. If the teacher doesn't have the stat, returns an empty string:
      {
      "name": "cele jmeno i s titulem",
      "username": "uzivatelske jmeno ucitele",
      "email": "email",
      "private_email": "soukromy email",
      "phones": {
        "mobile": cislo-mobilu,
        "link": cislo-linky,
        "private": "soukromy telefon ucitele",
      },
      "cabinet": "kabinet ucitele",
      "class_teacher": "trida kterou uci jako tridni",
      "consultations": "konzultacni hodiny ucitele",
      "image": "url obrazku ucitele",
      "schedule": schedule-object-ucitele,
      "certificates": [
        {
          "date": "datum certifikatu",
          "label": "nadpis certifikatu",
          "institution": "instituce certifikatu"
        }
      ]
      }
    */
    if (req.body.teacherShort === undefined && req.body.teacherShort === "") {
      res.status(400).send("Wrong teacher abbreviation");
      return;
    }

    const resTeacher = await authRequest(`/ucitel/${req.body.teacherShort}`, req.body.token);
    
    if (resTeacher.data.includes("Neoprávněný přístup")) {
      res.status(404).send("Teacher not found!");
      return; 
    }
    // using the parser

    try {
      const teacherJSON = teacherParser(resTeacher.data);
      res.status(200).send(JSON.stringify(teacherJSON));
    }
    catch (e) {
      console.log(e);
      if (e.isParserException) {
      res.status(400).send(e.message);
      } else {
      res.status(500).send("Internal Server Error. Please report this at https://github.com/HonzaKubita/jecnaAPI/issues");
      }
    }
  }
}