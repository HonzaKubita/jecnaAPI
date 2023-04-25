const {documentOf} = require("../../modules/utils");
const {constants} = require("../../modules/constants");
const {jecnaAuthRequest} = require("../../modules/http");
const {siteFound} = require("../../modules/checker");
const {parseSchedule} = require("../user/scheduleParser");

async function teacherParser(htmlBody, year, period, token) {
    const teacherDOM = documentOf(htmlBody);
    const teacherJSON = {
        name: "",
        username: "",
        email: "",
        privateEmail: "",
        phones: {
            mobiles: [],
            link: "",
            private: ""
        },
        cabinet: "",
        classTeacher: "",
        consultations: "",
        image: "",
        schedule: {},
        certificates: []
    };

    const propertiesTbody = teacherDOM.getElementsByClassName("userprofile")[0].children[0]; // propertiesTable.children[0]
    // parse image
    teacherJSON.image = constants.jecna.baseURL + teacherDOM
        .getElementsByClassName("image")[0] // imageDiv
        .children[0] // imageChild (img or noimage div)
        .src ?? ""; // link or ""
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
            case "Jméno":
                teacherJSON.name = propertyValue;
                break;
            case "Uživatelské jméno":
                teacherJSON.username = propertyValue;
                break;
            case "E-mail":
                teacherJSON.email = propertyValueRaw.children[1].innerHTML; // emailSpan.innerHTML
                break;
            case "Soukromý e-mail":
                teacherJSON.privateEmail = propertyValueRaw.children[1].innerHTML; // emailSpan.innerHTML
                break;
            case "Telefon":
                teacherJSON.phones.mobiles = [...new Set(propertyValue.split(" a linka ")[0].trim().split(", nebo ").map(a => a.trim()))];
                teacherJSON.phones.link = propertyValue
                    .split(" a linka ")[1]
                    .replaceAll(/<\/?strong>/g, "")
                    .trim();
                break;
            case "Soukromý telefon":
                teacherJSON.phones.private = propertyValue;
                break;
            case "Kabinet":
                teacherJSON.cabinet = propertyValueRaw.children[0].innerHTML; // cabinetSpan.innerHTML
                break;
            case "Třídní učitel":
                teacherJSON.classTeacher = propertyValue;
                break;
            case "Konzultační hodiny":
                teacherJSON.consultations = propertyValue;
                break;
        }
    }
    // parse schedule
    let scheduleLink = teacherDOM
        .getElementsByClassName("versionLink")?.[0]
        ?.children?.[0]
        ?.href;
    if (scheduleLink !== undefined) {
        scheduleLink =
            constants.jecna.baseURL + // add base url
            scheduleLink + // add the link
            (year === -1 ? "" : `&schoolYearId=${year}`) + // add school year
            (period === -1 ? "" : `&timeTableId=${period}`); // add period

        const scheduleRes = await jecnaAuthRequest(scheduleLink, token);
        siteFound(scheduleRes.data, `${year === -1 ? "" : `Year ${year}`}${year !== -1 && period !== -1 ? " or " : ""}${period === -1 ? "" : `Period ${period}`}`);

        teacherJSON.schedule = parseSchedule(scheduleRes.data);
    }
    // parse certificates
    const certificatesUl = teacherDOM.getElementsByClassName("certifications")?.[0];
    if (certificatesUl !== undefined) {
        for (const certificateLi of certificatesUl.children) {
            const certificateDate = certificateLi.getElementsByClassName("date")[0].innerHTML; // dateSpan.innerHTML
            const certificateLabel = certificateLi.getElementsByClassName("label")[0].innerHTML; // labelSpan.innerHTML
            const certificateInstitution = certificateLi.getElementsByClassName("institution")[0].innerHTML; // institutionSpan.innerHTML

            teacherJSON.certificates.push({
                date: certificateDate,
                label: certificateLabel,
                institution: certificateInstitution
            });
        }
    }

    return teacherJSON;
}

module.exports = {
    teacherParser
};