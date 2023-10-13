const {documentOf} = require("../../modules/utils");

function passingsParser(htmlBody) {
    const passingsDOM = documentOf(htmlBody);
    const passingsJSON = {
        passings: [],
        years: [],
        months: []
    };

    // parse years
    const yearSelect = passingsDOM.getElementById("schoolYearId");
    for (const yearOption of yearSelect.children) {
        passingsJSON.years.push({
            name: yearOption.innerHTML,
            id: parseInt(yearOption.value)
        });
    }
    // parse months
    const monthSelect = passingsDOM.getElementById("schoolYearPartMonthId");
    for (const monthOption of monthSelect.children) {
        passingsJSON.months.push({
            name: monthOption.innerHTML,
            id: parseInt(monthOption.value)
        });
    }
    // parse passings
    const passingsTbody = passingsDOM
        .getElementsByClassName("absence-list")[0] // passingsTable
        ?.children?.[0];

    if (passingsTbody === undefined) return passingsJSON;

    for (const passingTr of passingsTbody.children) {
        const passingDateSplit = passingTr.children[0].innerHTML.split("&nbsp;");
        const passingValues = passingTr.children[1].innerText.trim().split("\n").map(enterLeave => {
            const match = enterLeave.match(/Příchod (\d{1,2}:\d{2}), Odchod (\d{1,2}:\d{2})/);
            if (!match?.[1] && !match?.[2]) return [];
            return [match?.[1], match?.[2]];
        });

        const passingDate = passingDateSplit[0];
        const passingWeekDay = passingDateSplit[1].replaceAll(/[()]/g, "");

        passingsJSON.passings.push({
            date: passingDate,
            weekDay: passingWeekDay,
            times: passingValues
        });
    }

    return passingsJSON;
}

module.exports = {
    passingsParser
};