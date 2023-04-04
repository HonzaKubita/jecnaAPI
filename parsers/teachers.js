const {JSDOM} = require("jsdom");

const COLUMN_CLASSES = ["contentLeftColumn", "contentRightColumn"];

module.exports = function (htmlBody) {
    const teachersDOM = new JSDOM(htmlBody).window.document;
    let teachersJSON = {
        teachers: []
    };

    // parse every column
    COLUMN_CLASSES.forEach(columnClass => {
        for (const columnDiv of teachersDOM.getElementsByClassName(columnClass)) { // for every element of the current column
            for (const teacherLi of columnDiv.children[0]/* = column <ul> */.children) { // for every <li> (teacher)
                const teacherA = teacherLi.children[0]; // teacher <a> element

                const teacherName = teacherA.innerHTML;
                const teacherShort = teacherA.href.split("/")[2].toLocaleLowerCase();

                teachersJSON.teachers.push({
                    name: teacherName,
                    short: teacherShort
                });
            }
        }
    });

    // send it back
    return teachersJSON;
}