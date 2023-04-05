const { authRequest } = require('../../modules/http');
const scheduleParser = require("../../parsers/schedule");

module.exports = {
  post: async (req, res) => {
    /*
      Endpoint for receiving schedule
      TODO must contain period and year list
      Request must contain json body containing token you received from /login:
      {
        "token": "token_from_login"
      }

      Request will return json containing the schedule in the following format:
      {
        [
          [
            {
              "type": "lesson"
              "subject": "subjectName",
              "subjectShort": "subjectShort",
              "teacher": "teacher name",
              "teacherShort": "teacherShort",
              "start": "11:15",
              "end": "12:00",
              "classroom": "classroomNumber",
              "group":"2/2",
              "active": true
            },
            ...
          ],
          ...
        ]
      ...
    }
    */
    
    // Request html with schedule
    const resSchedule = await authRequest('/timetable/class', req.body.token);

    try {
      const parsedScheduleJSON = scheduleParser(resSchedule.data);
      res.status(200).send(JSON.stringify(parsedScheduleJSON));
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