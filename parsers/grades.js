const { JSDOM } = require("jsdom");

// Parser for grades
module.exports = (htmlBody) => {

  const gradesDOM = new JSDOM(htmlBody).window.document;
  const gradesBody = gradesDOM.getElementsByClassName("score")[0].children[1]; // tbody element

  let gradesJSON = {}; // Create new object to put the subjects with their grades into

  for (const subject of gradesBody.children) { // For every subject except behavior

    // Get the subject name
    let subjectName = "Subject";
    const subjectNameEl = subject.children[0];
    if (subjectNameEl)  
      subjectName = subjectNameEl.innerHTML;

    gradesJSON[subjectName] = {}; // Create new object to put the subject subsections into

    let subsection = "main"; // default subsection

    const subjectContents = subject.children[1].children;
    if (subjectContents.length < 1) continue;

    if (subjectContents[0].tagName == "A") { // Subject does not have defined first subsection
      gradesJSON[subjectName][subsection] = [];
    }
    else if (subjectContents[0].tagName == "SPAN") { // Not a subject, behavior
      // Parse behavior

      gradesJSON[subjectName][subsection] = []; // Prepare Array for records

      for (const record of subjectContents) { // Not actually subject contents but behavior records (in the school system behavior is a subject)
        let recordText = "";
        let recordTextEl = record.getElementsByClassName("label")[0];
        if (recordTextEl)
          recordText = recordTextEl.innerHTML;

        gradesJSON[subjectName][subsection].push(recordText);
      }

      break; // Break from loop of parsing grades and subsections
    }

    for (const element of subjectContents) { // For every element in subject (includes grades and subsections)

      if (element.tagName == "STRONG") { // New subsection = change subsection
        subsection = element.innerHTML.substring(0, element.innerHTML.lastIndexOf(": "));
        gradesJSON[subjectName][subsection] = []; // Create new array to put the grades into

      } else { // New grade = add new grade to current subsection

        let gradeObject = {
          grade: 0,
          description: "",
          date: "",
          teacher: "",
          teacherShort: ""
        };

        // Get grade data
        const dataEl = element;
        if (dataEl) {
          
          // Element with all the data about grade
          let data = dataEl.title;

          // Parse data from <a> title property

          const bracket = data.lastIndexOf("("); // The opening bracket before date (always there after it always same format)

          gradeObject.description = data.substring(0, bracket - 1);
          gradeObject.date = data.substring(bracket + 1, data.indexOf(",", bracket));
          gradeObject.teacher = data.substring(data.indexOf(",", bracket) + 2, data.length - 1);

          // Get grade and teacherShort from child elements
          const gradeEl = dataEl.getElementsByClassName("value")[0];
          if (gradeEl)
            gradeObject.grade = gradeEl.innerHTML;

          const teacherShortEl = dataEl.getElementsByClassName("employee")[0];
          if (teacherShortEl)
            gradeObject.teacherShort = teacherShortEl.innerHTML;
        }

        gradesJSON[subjectName][subsection].push(gradeObject);

      }
    }
  }

  return gradesJSON;

}