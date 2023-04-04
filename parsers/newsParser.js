const {JSDOM} = require("jsdom");
const {authRequest, BASE_URL} = require("../modules/http");
module.exports = {
    normal: function (htmlBody) {
        // get the main DOM
        const newsDOM = new JSDOM(htmlBody).window.document;
        // create a news object with default values
        let newsJSON = {
            news: []
        };

        // parse every event
        for (const eventDiv of newsDOM.getElementsByClassName("event")) {
            const eventTitle = eventDiv
                .getElementsByClassName("name")[0] // titleDiv
                .children[0] // title H2
                .children[0] // title A
                .innerHTML;
            const eventText = eventDiv
                .getElementsByClassName("text")[0] // textDiv
                .innerHTML;
            const eventAttachmentsList = resolveEventAttachments(
                eventDiv.getElementsByClassName("images"),
                eventDiv.getElementsByClassName("files")
            );
            const eventMiscData = resolveEventMiscData(
                eventDiv.getElementsByClassName("footer")[0].innerHTML
            );

            newsJSON.news.push({
                title: eventTitle,
                content: eventText,
                author: eventMiscData.author,
                date: eventMiscData.date,
                public: eventMiscData.public,
                attachments: eventAttachmentsList
            });
        }

        return newsJSON;
    },
    archive: async function (htmlBody, token, max, index) {
        // get the main DOM
        const newsDOM = new JSDOM(htmlBody).window.document;
        // create a news object with default values
        let newsJSON = {
            news: []
        };

        // for every event send get request
        const eventListUls = newsDOM
            .getElementsByClassName("column-center")[0] // gets the main column
            .getElementsByTagName("ul");

        let indexCounter = 0;

        for (const eventListUl of eventListUls) { // for every list of events
            for (const eventLi of eventListUl.children) { // for every event in the list
                if (index > indexCounter++) continue;// increment index after comparing it to the start index
                if (indexCounter - 1 - index === max) return newsJSON;

                const eventLink = eventLi.children[0]/* eventA */.href;
                // send the request to the server
                const resEvent = await authRequest(eventLink, token);
                // push resolved event object
                newsJSON.news.push(resolveNewsObject(resEvent.data));
            }
        }

        return newsJSON;
    }
}

function resolveNewsObject(eventHtmlBody) {
    // get the main DOM
    const eventDOM = new JSDOM(eventHtmlBody).window.document;

    // parse every value
    const eventDiv = eventDOM.getElementsByClassName("event")[0];

    const eventTitle = eventDOM
        .getElementById("h1") // <h1> title
        .getElementsByClassName("label")[0] // <span> title label
        .innerHTML;
    const eventText = eventDiv
        .getElementsByClassName("text")[0] // <div> text
        .innerHTML;
    const eventAttachmentsList = resolveEventAttachments(
        eventDOM.getElementsByClassName("gallery"),
        eventDiv.getElementsByClassName("files")
    );
    const eventMiscData = resolveEventMiscData(eventDiv
        .getElementsByClassName("info")[0] // info <p>
        .children[0] // info <em>
        .innerHTML
    );

    return {
        title: eventTitle,
        content: eventText,
        author: eventMiscData.author,
        date: eventMiscData.date,
        public: eventMiscData.public,
        attachments: eventAttachmentsList
    };
}
function resolveEventAttachments(imageDivs, fileUls) {
    let attachmentList = [];

    if (imageDivs.length !== 0) {
        const imagesDiv = imageDivs[0];
        for (const imageA of imagesDiv.children) { // for every image <a> fetch url and add it
            const imageUrl = `${BASE_URL}${imageA.href}`; // get the image url
            attachmentList.push(imageUrl); // push the url into the final array
        }
    }
    if (fileUls.length !== 0) {
        const filesUl = fileUls[0];
        for (const fileLi of filesUl.children) { // for every file <li>
            const fileA = fileLi.children[0]; // <a> of the file
            const fileUrl = `${BASE_URL}${fileA.href}`; // get the file url
            attachmentList.push(fileUrl); // push the url into the final array
        }
    }

    return attachmentList;
}
function resolveEventMiscData(miscText) {
    let eventMiscData = {
        date: "",
        author: "",
        public: true
    };

    const splittedValues = miscText
        .replace(", ", " | ") // replace , with | because in event description it has different format :/
        .split(" | ");

    eventMiscData.date = splittedValues[0];
    eventMiscData.author = splittedValues[1].trim();
    eventMiscData.public = splittedValues.length === 3 ? splittedValues[2] !== "Pouze pro školu" : true; // if it has 3 values, choose according to its value, or set it to true if not

    return eventMiscData;
}