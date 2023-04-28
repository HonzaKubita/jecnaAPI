const {documentOf} = require("../../modules/utils");

function absenceParser(htmlBody) {
    const absenceDOM = documentOf(htmlBody);
    const absenceJSON = {
        absence: [],
        years: []
    };

    // parse years
    const yearSelect = absenceDOM.getElementById("schoolYearId");
    for (const yearOption of yearSelect.children) {
        absenceJSON.years.push({
            name: yearOption.innerHTML,
            id: parseInt(yearOption.value)
        });
    }
    // parse absence
    const absenceTbody = absenceDOM
        .getElementsByClassName("absence-list")[0] // absenceTable
        ?.children?.[0];


    if (absenceTbody === undefined) return absenceJSON;

    for (const absenceTr of absenceTbody.children) {
        const absenceDateSplit = absenceTr.getElementsByClassName("nounderline")[0].innerHTML.split(" ");

        const absenceDate = absenceDateSplit[0];
        const absenceWeekDay = absenceDateSplit[1].replaceAll(/[()]/g, "");
        const absenceHours = parseInt(
            absenceTr.getElementsByClassName("count")[0]
                .children[0]
                .innerHTML
                .replaceAll(/hodin[ya]?/g, "")
        ); // parseInt(hoursTd.hoursStrong.innerHTML)

        absenceJSON.absence.push({
            date: absenceDate,
            weekDay: absenceWeekDay,
            hours: absenceHours
        });
    }

    return absenceJSON;
}

module.exports = {
    absenceParser
};