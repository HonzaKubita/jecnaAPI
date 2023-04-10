const {documentOf} = require("../../modules/utils");

function gradesParser(htmlBody) {
    const gradesDOM = documentOf(htmlBody);
    const gradesJSON = {
        subjects: [],
        behavior: "",
        years: [],
        halfTerms: []
    };

    // parse grades
    const gradesTbody = gradesDOM
        .getElementsByClassName("score")[0] // gradesTable
        .getElementsByTagName("tbody")[0];
    // parse subjects
    for (const subjectTr of gradesTbody.children) {
        const subjectNameMatch = subjectTr.children[0].innerHTML.match(/((?:[^\s(]+\s?)+)(?:\(?(.+)\))?/);

        const subjectName = subjectNameMatch[1].trim();
        const subjectShort = subjectNameMatch?.[2]?.trim() ?? "";
        const subjectFinal = subjectTr.getElementsByClassName("scoreFinal")?.[0]?.innerHTML ?? "";
        const subjectGroups = [];

        if (subjectName === "Chování") {
            gradesJSON.behavior = subjectFinal;
            continue;
        }

        // parse the subject groups
        let group = {
            name: "Main",
            grades: []
        };
        for (const gradeAOrStrong of subjectTr.children[1].children) { // gradesTd.children
            // parse group
            if (gradeAOrStrong.tagName === "STRONG") {
                // next group
                if (group.name !== "Main") subjectGroups.push(group);
                group = {
                    name: gradeAOrStrong.innerHTML.replace(": ", ""),
                    grades: []
                };
                continue;
            }
            if (gradeAOrStrong.tagName !== "A") continue;
            // parse grade
            const gradeTitleMatch = gradeAOrStrong.getAttribute("title").match(new RegExp("(.+)?\\(([\\d.]+), (.+)\\)"));

            const gradeValue = gradeAOrStrong.getElementsByClassName("value")[0].innerHTML; // gradeValueSpan.innerHTML
            const gradeTitle = gradeTitleMatch?.[1]?.trim() ?? "";
            const gradeTeacherShort = gradeAOrStrong.getElementsByClassName("employee")[0].innerHTML.toLocaleLowerCase(); // gradeTeacherSpan.innerHTML
            const gradeTeacherFull = gradeTitleMatch?.[3]?.trim() ?? "";
            const gradeSmall = gradeAOrStrong.classList.contains("scoreSmall");
            const gradeDate = gradeTitleMatch?.[2]?.trim() ?? "";

            group.grades.push({
                grade: gradeValue,
                title: gradeTitle,
                teacherShort: gradeTeacherShort,
                teacherFull: gradeTeacherFull,
                small: gradeSmall,
                date: gradeDate
            });
        }
        subjectGroups.push(group);

        gradesJSON.subjects.push({
            short: subjectShort,
            name: subjectName,
            final: subjectFinal,
            groups: subjectGroups
        });
    }
    // parse years
    const yearSelect = gradesDOM.getElementById("schoolYearId");
    for (const yearOption of yearSelect.children) {
        gradesJSON.years.push({
            name: yearOption.innerHTML,
            id: Number(yearOption.value)
        });
    }
    // parse half-terms
    const halfTermSelect = gradesDOM.getElementById("schoolYearHalfId");
    for (const halfTermOption of halfTermSelect.children) {
        gradesJSON.halfTerms.push({
            name: halfTermOption.innerHTML,
            id: Number(halfTermOption.value)
        });
    }

    return gradesJSON;
}

module.exports = {
    gradesParser
}