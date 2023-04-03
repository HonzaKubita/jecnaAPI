const { JSDOM } = require("jsdom");

// Parser for schedule
module.exports = (htmlBody) => {

  let scheduleJSON = {
    times: [],
    days: []
  };

  // Parse html to json
  const scheduleDOM = new JSDOM(htmlBody).window.document;
  const scheduleTBody = scheduleDOM.getElementsByClassName("timetable")[1].children[0]; // tbody element
  
  // parse times = scheduleTable.children[0]
  const timesRow = scheduleTBody.children[0];
  for (const time of timesRow.getElementsByClassName("period")) { // for every period child
    const timeString = time.children[0].innerHTML; // get times
    const times = timeString.split(" - "); // split
    scheduleJSON.times.push({ // push into object
      start: times[0],
      end: times[1]
    });
  }

  // parse scheduleTable

  const days = scheduleTBody.children;
  for (const day of days) {
    if (day === scheduleTBody.children[0]) continue; // Skip the first element as it is a row with times
      
    let dayLessons = [];

    const lessons = day.children;
    for (const lesson of lessons) {
      if (lesson.classList.contains("day")) continue; // Skip first element as it is a block with day label not a lesson

      let lessonGroupLessons = [];

      // Determine type skip getting data is lesson is break

      if (lesson.classList.contains("empty")) { // Lesson is a break, push empty and break from loop
        lessonGroupLessons.push({
          type: "break",
        });
      }

      const groupLessons = lesson.children;
      for (const groupLesson of groupLessons) {

        let groupLessonJSON = {
          type: "",
          classroom: "",
          teacher: "",
          teacherShort: "",
          subject: "",
          subjectShort: "",
          groupName: "",
          active: false
        };

        // Get data from html

        groupLessonJSON.type = "lesson";

        let classroomEl = groupLesson.getElementsByClassName("room")[0];
        if (classroomEl)
          groupLessonJSON.classroom = classroomEl.innerHTML; // Get classroom abbreviation

        const teacherEl = groupLesson.getElementsByClassName("employee")[0]; // Get the full teacher element
        if (teacherEl) {
          groupLessonJSON.teacherShort = teacherEl.innerHTML; // Get teacher abbreviation
          groupLessonJSON.teacher = teacherEl.title;  // Get full name of the teacher
        }

        const subjectEl = groupLesson.getElementsByClassName("subject")[0]; // Get the full subject element
        if (subjectEl) {
          groupLessonJSON.subjectShort = subjectEl.innerHTML; // Get subject abbreviation
          groupLessonJSON.subject = subjectEl.title;  // Get full subject name
        }

        groupLessonJSON.group = groupLesson.getElementsByClassName("group") ? "0" : groupLesson.getElementsByClassName("group")[0]; // Get the group name, 0 if the group is the whole class

        groupLessonJSON.active = lesson.classList.contains("actual"); // If the lesson happening now
        
        // I think that sending class name is useless that's why is it not here

        // Push group lesson to the lesson
        lessonGroupLessons.push(groupLessonJSON); // 

      }

      // Push lessons to the day
      dayLessons.push(lessonGroupLessons); // lessonGroupLessonsJSON??

    }

    // Push day to schedule
    scheduleJSON.days.push(dayLessons);

  }
  
  return scheduleJSON;
}