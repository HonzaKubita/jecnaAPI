const {documentOf} = require("../../modules/utils");
const {parseEventMiscData, parseEventAttachments} = require("./eventParser");

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

module.exports = {
    newsParser
}