const {documentOf, objectIsEmpty} = require("../../modules/utils");

function foodParser(htmlBody, list) {
    const foodDOM = documentOf(htmlBody);
    const foodJSON = {
        lunches: []
    };

    for (const dayDiv of foodDOM.getElementsByClassName("jidelnicekDen")) {
        const dayTopMatch = dayDiv.children[0].innerHTML.trim().match(/Jídelníček na\s+(\d\d\.\d\d\.\d\d\d\d) - (.+)/); // day => dayTop
        const lunchDate = dayTopMatch?.[1];
        const dayOfTheWeek = dayTopMatch?.[2];

        const lunch1 = parseLunch(findLunch(dayDiv.children[1], 1)); // day => lunchesArticle
        const lunch2 = parseLunch(findLunch(dayDiv.children[1], 2));

        if (objectIsEmpty(lunch1 ?? {}) && objectIsEmpty(lunch2 ?? {})) continue;

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
 * @param lunchDiv{Element}
 * @return {{food: string, allergens: number[]} | undefined}
 */
function parseLunch(lunchDiv) {
    const lunch = lunchDiv?.children[2].innerText.trim();
    const lunchMatch = lunch?.match(/(.+) \(((?:\d(?:, )?)+)\)/);
    const food = lunchMatch?.[1] ?? lunch

    if (!food) return undefined;

    return {
        food: food,
        allergens: lunchMatch?.[2]?.split(", ")?.map(o => parseInt(o)) ?? []
    };
}

/**
 * Finds a specific lunch element
 * @param lunchesArticle{Element}
 * @param num{1|2}
 * @returns {Element}
 */
function findLunch(lunchesArticle, num) {
    for (const lunchDiv of lunchesArticle.children) {
        if (
            lunchDiv.children[1].innerText.trim() === "Ječná" &&
            lunchDiv.children[0].innerText.trim().includes(num.toString())
        ) return lunchDiv;
    }
    return undefined;
}

module.exports = {
    foodParser
};