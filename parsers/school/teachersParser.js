const {documentOf} = require("../../modules/utils");
const COLUMNS = ["contentLeftColumn", "contentRightColumn"];
function teachersParser(htmlBody) {
    const teachersDOM = documentOf(htmlBody);
    const teachersJSON = {
        teachers: []
    };

    for (const column of COLUMNS) {
        const columnDiv = teachersDOM.getElementsByClassName(column)[0];
        for (const teacherA of columnDiv.getElementsByTagName("a")) {
            const teacherName = teacherA.innerHTML;
            const teacherShort = teacherA.href.split("/")[2].toLocaleLowerCase();

            teachersJSON.teachers.push({
                name: teacherName,
                short: teacherShort
            });
        }
    }

    return teachersJSON;
}

module.exports = {
    teachersParser
}