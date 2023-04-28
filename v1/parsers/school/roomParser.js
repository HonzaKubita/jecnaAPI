const {documentOf} = require("../../modules/utils");
const {constants} = require("../../modules/constants");
const {jecnaAuthRequest} = require("../../modules/http");
const {siteFound} = require("../../modules/checker");
const {parseSchedule} = require("../user/scheduleParser");

async function roomParser(htmlBody, year, period, token) {
    const roomDOM = documentOf(htmlBody);
    const roomJSON = {
        admin: {
            name: "",
            short: ""
        },
        phones: {
            mobiles: [],
            link: 0
        },
        floor: -1,
        class: "",
        schedule: {}
    };

    const propertiesTbody = roomDOM.getElementsByClassName("userprofile")[0].children[0]; // propertiesTable.children[0]
    // parse properties
    for (const propertyTr of propertiesTbody.children) {
        const propertyName = propertyTr
            .getElementsByClassName("label")[0] // nameSpan
            .innerHTML;
        const propertyValueRaw = propertyTr
            .children[1] // valueTd
            .children?.[0]; // value span or a
        const propertyValue = propertyValueRaw?.innerHTML;

        if (propertyValue === undefined) continue;
        switch (propertyName) {
            case "Správce":
                roomJSON.admin.name = propertyValueRaw.children[1].innerHTML;
                roomJSON.admin.short = propertyValueRaw.href.split("/")[2].toLocaleLowerCase();
                break;
            case "Telefon":
                roomJSON.phones.mobiles = [...new Set(propertyValue.split(" a linka ")[0].trim().split(", nebo ").map(a => a.trim()))];
                roomJSON.phones.link = parseInt(propertyValue
                    .split(" a linka ")[1]
                    .replaceAll(/<\/?strong>/g, "")
                    .trim());
                break;
            case "Podlaží":
                const floorMatch = propertyValue.match(/(\d)\. patro|Přízemí/);
                roomJSON.floor = parseInt(floorMatch?.[1] ?? 0);
                break;
            case "Kmenová učebna":
                const classMatch = propertyValue.match(/(.+) \((.+)\)/);
                roomJSON.class = classMatch[1];
                roomJSON.admin.name = classMatch[2];
                break;
        }
    }
    // parse schedule
    let scheduleLink = roomDOM
        .getElementsByClassName("versionLink")?.[0]
        ?.children?.[0]
        ?.href;
    if (scheduleLink !== undefined) {
        scheduleLink =
            constants.jecna.baseURL + // add base url
            scheduleLink + // add the link
            (year === -1 ? "" : `&schoolYearId=${year}`) + // add school year
            (period === -1 ? "" : `&timetableId=${period}`); // add period

        const scheduleRes = await jecnaAuthRequest(scheduleLink, token);
        siteFound(scheduleRes.data, `${year === -1 ? "" : `Year ${year}`}${year !== -1 && period !== -1 ? " or " : ""}${period === -1 ? "" : `Period ${period}`}`);

        roomJSON.schedule = parseSchedule(scheduleRes.data);
    }

    return roomJSON;
}

module.exports = {
    roomParser
};