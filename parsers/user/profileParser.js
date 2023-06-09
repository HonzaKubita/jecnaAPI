const {documentOf} = require("../../modules/utils");
const {constants} = require("../../modules/constants");
const logger = require("../../modules/logger");

function profileParser(htmlBody, token) {
    const profileDOM = documentOf(htmlBody);
    const profileJSON = {
        name: "",
        username: "",
        age: 0,
        birth: "",
        phone: "",
        homeAddress: "",
        contactAddress: undefined,
        grade: "",
        groups: [],
        reportNum: 0,
        privateEmail: "",
        schoolEmail: "",
        image: "",
        guardians: [],
        support: {
            variableSymbol: 0,
            bankAccount: ""
        }
    };

    const mainTbody = profileDOM.getElementsByClassName("userprofile")[0].children[0];
    const supportTbody = profileDOM.getElementsByClassName("userprofile")[2].children[0];
    const guardiansUl = profileDOM.getElementsByClassName("list")[0];
    // parse image
    profileJSON.image = constants.jecna.baseURL + profileDOM
        .getElementsByClassName("image")[0] // imageDiv
        .children[0] // imageChild (img or noimage div)
        .src ?? ""; // link or ""
    // parse main properties
    for (const propertyTr of mainTbody.children) {
        const propertyName = propertyTr
            .getElementsByClassName("label")[0] // nameSpan
            .innerHTML;
        const propertyValueRaw = propertyTr
            .children[1] // valueTd
            .children?.[0]; // value span or a
        const propertyValue = propertyValueRaw?.innerHTML;

        if (propertyValue === undefined) continue;

        switch (propertyName) {
            case "Celé jméno":
                profileJSON.name = propertyValue;
                break;
            case "Uživatelské jméno":
                profileJSON.username = propertyValue;
                break;
            case "Věk":
                profileJSON.age = parseInt(propertyValue.split(" ")?.[0] ?? 0);
                break;
            case "Narození":
                profileJSON.birth = propertyValue;
                break;
            case "Telefon":
                profileJSON.phone = propertyValue;
                break;
            case "Trvalá adresa":
                profileJSON.homeAddress = propertyValue;
                break;
            case "Kontaktní adresa":
                profileJSON.contactAddress = propertyValue;
                break;
            case "Třída, skupiny":
                profileJSON.grade = propertyValue.split(", skupiny: ")[0];
                profileJSON.groups = propertyValue.split(", skupiny: ")[1].trim().split(", ").map(u => u.trim());
                break;
            case "Číslo v tříd. výkazu":
                profileJSON.reportNum = parseInt(propertyValue);
                if (isNaN(profileJSON.reportNum)) {
                    logger.warn(`ERROR: reportNum is not a number. It's value: ${propertyValue}. Login token: ${token}`);
                    profileJSON.reportNum = propertyValue;
                }
                break;
            case "Soukromý e-mail":
                profileJSON.privateEmail = propertyValueRaw.children[1].innerHTML;
                break;
            case "Školní e-mail":
                profileJSON.schoolEmail = propertyValueRaw.getElementsByClassName("label")[0].innerHTML;
                break;
        }
    }
    profileJSON.contactAddress ??= profileJSON.homeAddress;
    // parse guardians
    for (const guardianLi of guardiansUl.children) {
        const guardianProps = guardianLi.getElementsByClassName("label")[0].innerHTML.split(", ");
        profileJSON.guardians.push({
            name: guardianProps[0],
            phone: guardianProps[1],
            email: guardianProps[2]
        });
    }
    // parse support
    for (const propertyTr of supportTbody.children) {
        const propertyName = propertyTr
            .getElementsByClassName("label")[0] // nameSpan
            .innerHTML;
        const propertyValueRaw = propertyTr
            .children[1] // valueTd
            .children?.[0]; // value span or a
        const propertyValue = propertyValueRaw?.innerHTML;

        if (propertyValue === undefined) continue;

        switch (propertyName) {
            case "Variabliní symbol žáka":
                profileJSON.support.variableSymbol = parseInt(propertyValue);
                if (isNaN(profileJSON.support.variableSymbol)) {
                    logger.warn(`ERROR: variableSymbol is not a number. It's value: ${propertyValue}. Login token: ${token}`);
                    profileJSON.support.variableSymbol = propertyValue;
                }
                break;
            case "Bankovní účet":
                profileJSON.support.bankAccount = propertyValue;
                break;
        }
    }

    return profileJSON;
}

function profileEditParser(htmlBody) {
    const profileEditDOM = documentOf(htmlBody);

    const email = profileEditDOM.getElementById("email")?.value ?? "";
    const phone = profileEditDOM.getElementById("phone")?.value ?? "";
    const street = profileEditDOM.getElementById("street")?.value ?? "";
    const houseNumber = profileEditDOM.getElementById("streetNumber")?.value ?? "";
    const zip = profileEditDOM.getElementById("zip")?.value ?? "";

    let selectedInsurance;
    const possibleInsurances = [];
    for (const option of profileEditDOM.getElementById("healthInsuranceId").children) {
        const insurance = {
            id: parseInt(option.value),
            name: option.getAttribute("label")
        };
        if (option.getAttribute("selected") === "selected") selectedInsurance = insurance;
        possibleInsurances.push(insurance);
    }
    let selectedVillage;
    const possibleVillages = [];
    for (const option of profileEditDOM.getElementById("czMsmtRaujId").children) {
        const village = {
            id: parseInt(option.value),
            name: option.getAttribute("label")
        };
        if (option.getAttribute("selected") === "selected") selectedVillage = village;
        possibleVillages.push(village);
    }

    return {
        email: email,
        phone: phone,
        street: street,
        houseNumber: houseNumber,
        zip: zip,
        insurance: {
            current: selectedInsurance,
            possibleValues: possibleInsurances
        },
        village: {
            current: selectedVillage,
            possibleValues: possibleVillages
        }
    };
}

module.exports = {
    profileParser,
    profileEditParser
};