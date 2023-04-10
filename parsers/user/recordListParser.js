const {documentOf} = require("../../modules/utils");
const {jecnaAuthRequest} = require("../../modules/http");
const {recordParser} = require("./recordParser");

function recordListParser(htmlBody, index, max) {
    const recordListDOM = documentOf(htmlBody);
    const recordListJSON = {
        records: []
    };

    const recordListUl = recordListDOM.getElementsByClassName("list")[0];

    let indexCounter = 0;
    for (const recordLi of recordListUl.children) {
        if (index > indexCounter++) continue; // so it starts on the right index
        if (indexCounter - 1 - index === max) return recordListJSON; // return if max reached

        const recordA = recordLi.children[0];
        const recordDescSplit = recordA.children[1].innerHTML.split(", ");

        const recordId = Number(recordA.href.split("=")[1]);
        const recordGood = recordA.children[0].classList.contains("sprite-icon-tick-16");
        const recordDate = recordDescSplit[0];
        const recordText = recordDescSplit.slice(1).join(", ");

        recordListJSON.records.push({
            id: recordId,
            good: recordGood,
            date: recordDate,
            text: recordText
        });
    }

    return recordListJSON;
}

async function recordListExpandParser(htmlBody, index, max, token) {
    const recordListDOM = documentOf(htmlBody);
    const recordListJSON = {
        records: []
    };

    const recordListUl = recordListDOM.getElementsByClassName("list")[0];

    let indexCounter = 0;
    for (const recordLi of recordListUl.children) {
        if (index > indexCounter++) continue; // so it starts on the right index
        if (indexCounter - 1 - index === max) return recordListJSON; // return if max reached

        const recordLink = recordLi.children[0].href; // recordA.href
        const recordRes = await jecnaAuthRequest(recordLink, token);
        recordListJSON.records.push(recordParser(recordRes.data));
    }

    return recordListJSON;
}

module.exports = {
    recordListParser,
    recordListExpandParser
}