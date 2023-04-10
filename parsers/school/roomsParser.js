const {documentOf} = require("../../modules/utils");

function roomsParser(htmlBody) {
    const roomsDOM = documentOf(htmlBody);
    const roomsJSON = {
        rooms: []
    };

    for (const roomLi of roomsDOM.getElementsByClassName("list")[0].children) { // roomsUl.children
        const roomLabel = roomLi.getElementsByClassName("label")[0].innerHTML;
        const roomLabelMatch = roomLabel.match(/((?:[^\s(]+\s?)+)(?:\((?:(.+), (.+)|Správce: (.+))\))?/);

        const roomShort = roomLi
            .children[0] // roomA
            .href.split("/")[2];
        const roomName = roomLabelMatch?.[1]?.trim() ?? "";
        const roomClass = roomLabelMatch?.[2] ?? "";
        const roomAdmin = roomLabelMatch?.[3] ?? roomLabelMatch?.[4] ?? "";

        roomsJSON.rooms.push({
            short: roomShort,
            name: roomName,
            class: roomClass,
            admin: roomAdmin
        });
    }

    return roomsJSON;
}

module.exports = {
    roomsParser
}