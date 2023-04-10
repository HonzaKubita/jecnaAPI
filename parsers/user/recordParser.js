const {documentOf} = require("../../modules/utils");

function recordParser(htmlBody) {
    const recordDOM = documentOf(htmlBody);
    const recordJSON = {
        type: "",
        date: "",
        reason: "",
        referenceNumber: ""
    };

    // parse icon
    recordJSON.good = recordDOM.getElementsByClassName("sprite-icon-tick-32").length > 0;

    // parse properties
    const propertiesTbody = recordDOM.getElementsByClassName("userprofile")[0].children[0]; // propertiesTable.children[0]
    for (const propertyTr of propertiesTbody.children) {
        const propertyName = propertyTr
            .getElementsByClassName("label")[0] // nameSpan
            .innerHTML;
        const propertyValue = propertyTr
            .getElementsByClassName("value")?.[0] // valueSpan
            ?.innerHTML;

        if (propertyValue === undefined) continue;

        switch (propertyName) {
            case "Typ":
                recordJSON.type = propertyValue;
                break;
            case "Datum":
                recordJSON.date = propertyValue;
                break;
            case "Sdělení":
                recordJSON.reason = propertyValue;
                break;
            case "Číslo&nbsp;jednací":
                recordJSON.referenceNumber = propertyValue;
                break;
        }
    }

    return recordJSON;
}

module.exports = {
    recordParser
}