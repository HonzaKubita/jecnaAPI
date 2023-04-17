const {constants} = require("../../modules/constants");
const {documentOf} = require("../../modules/utils");

/**
 *
 * @param htmlBody
 * @return {{date: string, attachments: string[], public: boolean, author: string, title: string, content: string}}
 */
function eventParser(htmlBody) {
    const eventDOM = documentOf(htmlBody);

    const eventDiv = eventDOM.getElementsByClassName("event")[0];

    const eventTitle = eventDOM
        .getElementById("h1") // titleH1
        .getElementsByClassName("label")[0] // titleSpan
        .innerHTML;
    const eventContent = eventDiv
        .getElementsByClassName("text")[0] // textDiv
        .innerHTML;
    const eventMiscData = parseEventMiscData(eventDiv
        .getElementsByClassName("info")[0] // infoP
        .children[0] // infoEm
        .innerHTML
    );
    const eventAttachments = parseEventAttachments(
        eventDOM.getElementsByClassName("gallery"),
        eventDOM.getElementsByClassName("files")
    );

    return {
        title: eventTitle,
        content: eventContent,
        author: eventMiscData.author,
        date: eventMiscData.date,
        public: eventMiscData.public,
        attachments: eventAttachments
    };
}
/**
 * Parses misc data from event
 * @param miscText{string} The text
 * @returns {{date: string, public: boolean, author: string}} The data
 */
function parseEventMiscData(miscText) {
    let eventMiscData = {
        date: "",
        author: "",
        public: true
    };

    const splitValues = miscText
        .replace(", ", " | ") // replace , with | because in event description it has different format :/
        .split(" | ");

    eventMiscData.date = splitValues[0];
    eventMiscData.author = splitValues[1].trim();
    eventMiscData.public = splitValues.length === 3 ? splitValues[2] !== "Pouze pro školu" : true; // if it has 3 values, choose according to its value, or set it to true if not

    return eventMiscData;
}

/**
 * Parses event attachments
 * @param imageDivs{HTMLCollectionOf<Element>} Collection of image divs
 * @param fileUls{HTMLCollectionOf<Element>} Collection of file uls
 * @returns {string[]} The attachment array
 */
function parseEventAttachments(imageDivs, fileUls) {
    let attachmentList = [];

    if (imageDivs.length !== 0) {
        const imagesDiv = imageDivs[0];
        for (const imageA of imagesDiv.children) { // for every image <a> fetch url and add it
            const imageUrl = `${constants.jecna.baseURL}${imageA.href}`; // get the image url
            attachmentList.push(imageUrl); // push the url into the final array
        }
    }
    if (fileUls.length !== 0) {
        const filesUl = fileUls[0];
        for (const fileLi of filesUl.children) { // for every file <li>
            const fileA = fileLi.children[0]; // <a> of the file
            const fileUrl = `${constants.jecna.baseURL}${fileA.href}`; // get the file url
            attachmentList.push(fileUrl); // push the url into the final array
        }
    }

    return attachmentList;
}

module.exports = {
    parseEventMiscData,
    parseEventAttachments,
    eventParser
}