const {documentOf} = require("../../modules/utils");
const {jecnaAuthRequest} = require("../../modules/http");
const {eventParser} = require("./eventParser");

function archiveParser(htmlBody, index, max) {
    const archiveDOM = documentOf(htmlBody);
    const archiveJSON = {
        news: []
    };

    const eventListUls = archiveDOM
        .getElementsByClassName("column-center")[0] // main div
        .getElementsByTagName("ul"); // all uls

    let indexCounter = 0;
    for (const eventListUl of eventListUls) {
        for (const eventLi of eventListUl.children) { // for every event Li
            if (index > indexCounter++) continue; // compare to the start index and increment afterward
            if (indexCounter - 1 - index === max) return archiveJSON; // return if max is reached

            const eventTitle = eventLi
                .getElementsByClassName("label")[0] // eventSpan
                .innerHTML;
            const eventCode = eventLi.children[0].href.split("/")[2]; // the code from the link in format '/akce/code'

            archiveJSON.news.push({
                title: eventTitle,
                code: eventCode
            });
        }
    }

    return archiveJSON;
}
async function archiveExpandParser(htmlBody, token, index, max) {
    const archiveDOM = documentOf(htmlBody);
    const archiveJSON = {
        news: []
    };

    const eventListUls = archiveDOM
        .getElementsByClassName("column-center")[0] // main div
        .getElementsByTagName("ul"); // all uls

    let indexCounter = 0;
    for (const eventListUl of eventListUls) {
        for (const eventLi of eventListUl.children) { // for every event Li
            if (index > indexCounter++) continue; // compare to the start index and increment afterward
            if (indexCounter - 1 - index === max) return archiveJSON; // return if max is reached

            const eventLink = eventLi.children[0].href; // eventA.href
            const eventRes = await jecnaAuthRequest(eventLink, token);
            archiveJSON.news.push(eventParser(eventRes.data));
        }
    }

    return archiveJSON;
}

module.exports = {
    archiveParser,
    archiveExpandParser
}