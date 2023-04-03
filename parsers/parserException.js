module.exports = class ParserException {

  isParserException = true;

  constructor(message) {
    this.message = message;
  }
}

/*
Example implementation:

try {
  const parsedScheduleJSON = scheduleParser(resSchedule.data);
  res.status(200).send(JSON.stringify(parsedScheduleJSON));
}
catch (e) {
  console.log(e);
  if (e.isParserException) {
    res.status(400).send(e.message);
  } else {
    res.status(500).send("Internal Server Error. Please report this at https://github.com/HonzaKubita/jecnaAPI/issues");
  }
}
*/