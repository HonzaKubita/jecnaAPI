const {documentOf} = require("../../modules/utils");


function foodParser(htmlBody, list) {
    const foodDOM = documentOf(htmlBody);
    const foodJSON = {
        lunches: []
    };

    for (const dayDiv of foodDOM.getElementsByClassName("jidelnicekDen")) {
        const lunchDate = dayDiv
            .getElementsByClassName("important")[0]
            .innerHTML.trim();
        const dayOfTheWeek = dayDiv
            .getElementsByTagName("span")[1]
            .innerHTML.trim();

        const lunch1 = parseLunch(dayDiv.children[1].children[4]); // day => lunchesDiv => lunchDiv
        const lunch2 = parseLunch(dayDiv.children[1].children[5]);

        const lunchJSON = {
            date: lunchDate,
            dayOfWeek: dayOfTheWeek,
            lunch1: lunch1,
            lunch2: lunch2
        };
        if (!list) return lunchJSON;
        foodJSON.lunches.push(lunchJSON);
    }

    return foodJSON;
}

/**
 *
 * @param lunchDiv{HTMLDivElement}
 * @returns {{food:string,allergens:string[]}}
 */
function parseLunch(lunchDiv) {
    const match = lunchDiv
        .textContent // Oběd 1 -- Ječná -- Polévka ze zeleného hrášku, ;vepřové po štýrsku, brambory, ovocný čaj, (1, 3, 7, 9)
        .split("--")[2] //  Polévka ze zeleného hrášku, ;vepřové po štýrsku, brambory, ovocný čaj, (1, 3, 7, 9)
        .trim() // Polévka ze zeleného hrášku, ;vepřové po štýrsku, brambory, ovocný čaj, (1, 3, 7, 9)
        .match(new RegExp("(.*),\\s*\\((.+)\\)")); // groups

    return {
        food: match?.[1],
        allergens: match?.[2].split(", ")
    };
}

module.exports = {
    foodParser
}