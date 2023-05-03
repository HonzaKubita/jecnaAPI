const {fetchArchive} = require("./archiveFetch");
const {documentOf} = require("../../modules/utils");
const {parseEventMiscData, parseEventAttachments, eventParser} = require("./eventParser");
const {jecnaAuthRequest, jecnaPostRequestAuth} = require("../../modules/http");

function newsParser(htmlBody) {
    const newsDOM = documentOf(htmlBody);
    const newsJSON = {
        news: []
    };

    for (const eventDiv of newsDOM.getElementsByClassName("event")) {
        const eventTitle = eventDiv
            .getElementsByClassName("name")[0] // titleDiv
            .children[0] // titleH2
            .children[0] // titleA
            .innerHTML;
        const eventContent = eventDiv
            .getElementsByClassName("text")[0] // contentDiv
            .innerHTML;
        const eventMiscData = parseEventMiscData(eventDiv
            .getElementsByClassName("footer")[0] // miscDataDiv
            .innerHTML
        );
        const eventAttachments = parseEventAttachments(
            eventDiv.getElementsByClassName("images"), // imagesDivs
            eventDiv.getElementsByClassName("files") // fileUls
        );

        newsJSON.news.push({
            title: eventTitle,
            content: eventContent,
            author: eventMiscData.author,
            date: eventMiscData.date,
            public: eventMiscData.public,
            attachments: eventAttachments
        });
    }

    return newsJSON;
}

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
                code: parseInt(eventCode)
            });
        }
    }

    return archiveJSON;
}

async function archiveExpandParser(htmlBody, token, index, max, req) {
    // Get the fetch list
    const fList = await fetchArchive(token, req);
    if (fList !== false) return fList;

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
    newsParser,
    archiveParser,
    archiveExpandParser
};