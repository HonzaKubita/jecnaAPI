const {documentOf} = require("../../modules/utils");

function parseSchedule(htmlBody) {
    const scheduleDOM = documentOf(htmlBody);
    const scheduleJSON = {
        times: [],
        days: [],
        years:[],
        periods: []
    };

    // parse years
    const yearSelect = scheduleDOM.getElementById("schoolYearId");
    for (const yearOption of yearSelect.children) {
        scheduleJSON.years.push({
            name: yearOption.innerHTML,
            id: Number(yearOption.value)
        });
    }
    // parse periods
    const periodSelect = scheduleDOM.getElementById("timetableId");
    for (const periodOption of periodSelect.children) {
        scheduleJSON.periods.push({
            name: periodOption.innerHTML,
            id: Number(periodOption.value)
        });
    }

    const scheduleTbody = scheduleDOM
        .getElementsByClassName("timetable")[1] // scheduleTable
        ?.children?.[0];
    if (scheduleTbody === undefined) return scheduleJSON;

    // parse times
    for (const timeTh of scheduleTbody.getElementsByClassName("period")) {
        const timeText = timeTh.children[0].innerHTML.toString();

        const timeLesson = timeTh.textContent.replace(timeText, "");
        const timeStart = timeText.split(" - ")[0];
        const timeEnd = timeText.split(" - ")[1];

        scheduleJSON.times.push({
            lesson: timeLesson,
            start: timeStart,
            end: timeEnd
        });
    }

    // parse days
    days: for (let i = 1; i < scheduleTbody.children.length; i++) {
        const dayTr = scheduleTbody.children[i];

        const subjectsJSON = [];

        let daySubjects = 0;
        let dayShort = "";

        let bigSubjectAdds = 0;
        let emptySubjects = 0;
        // parse lessons
        subjects: for (const subjectTd of dayTr.children) {
            const lessonsJSON = [];
            // eliminate day name
            if (subjectTd.tagName === "TH") {
                dayShort = subjectTd.innerHTML;
                continue;
            }
            // check empty
            if (subjectTd.classList.contains("empty")) {
                emptySubjects++;
                subjectsJSON.push([{
                    type: "break"
                }]);
                continue;
            }
            // normal subject
            // this is the same for all classes
            const subjectLength = Number(subjectTd.getAttribute("colspan") ?? 1);
            bigSubjectAdds += subjectLength - 1;
            // parse lessons
            lessons: for (const lessonDiv of subjectTd.children) {
                const nameSpan = lessonDiv.getElementsByClassName("subject")[0];
                const teacherSpan = lessonDiv.getElementsByClassName("employee")[0]; // undefinable

                const lessonType = resolveLessonType(nameSpan.title);
                // check if it is lesson
                if (lessonType !== "lesson") {
                    lessonsJSON.push({
                        type: lessonType,
                        length: subjectLength
                    });
                    continue;
                }
                // parse lesson:
                const lessonShort = nameSpan.innerHTML;
                const lessonName = nameSpan.title;
                const lessonTeacherShort = teacherSpan?.innerHTML.toString() ?? "";
                const lessonTeacherFull = teacherSpan?.title ?? "";
                const lessonClassroom = lessonDiv.getElementsByClassName("room")[0]?.innerHTML?.toString() ?? "";
                const lessonClass = lessonDiv.getElementsByClassName("class")[0]?.innerHTML?.toString() ?? "";
                const lessonGroup = lessonDiv.getElementsByClassName("group")[0]?.innerHTML?.toString() ?? "0";

                lessonsJSON.push({
                    type: lessonType,
                    short: lessonShort,
                    name: lessonName,
                    teacherShort: lessonTeacherShort,
                    teacherFull: lessonTeacherFull,
                    classroom: lessonClassroom,
                    class: lessonClass,
                    group: lessonGroup,
                    length: subjectLength
                });
            }

            daySubjects += emptySubjects + subjectLength; // add empty lessons and increment
            emptySubjects = 0;

            subjectsJSON.push(lessonsJSON);
        }

        scheduleJSON.days.push({
            dayShort: dayShort,
            lessons: daySubjects,
            subjects: subjectsJSON.slice(0, daySubjects - bigSubjectAdds)
        });
    }

    return scheduleJSON;
}

/**
 *
 * @param name{string}
 * @returns {string}
 */
function resolveLessonType(name) {
    switch (name) {
        case "Porada vedení":
            return "staff-meeting";
        case "Porada":
            return "meeting";
        case "Pohotovost":
            return "emergency";
        default:
            return "lesson";
    }
}

module.exports = {
    parseSchedule
}