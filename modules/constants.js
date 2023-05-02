const path = require("path");
const constants =
    {
        repo: "https://github.com/HonzaKubita/jecnaAPI",
        jecna: {
            baseURL: "https://www.spsejecna.cz",
            sessionCookieName: "JSESSIONID",
            notFoundMessages: ["Pro pokračování se přihlaste do systému", "Neoprávněný přístup", "Stránka nebyla nalezena"],
            wrongToken: "wrongToken"
        },
        food: {
            baseURL: "https://objednavky.jidelnasokolska.cz",
            sessionCookieName: "JSESSIONID",
            tokenCookieName: "XSRF-TOKEN"
        },
        moodle: {
            baseURL: "https://moodle.spsejecna.cz",
            sessionCookieName: "MoodleSession",
            idCookieName: "MOODLEID1_"
        },
        logs: {
            logsFolder: path.resolve("logs"),
            fullLogsFolder: path.resolve("logs/full"),
            counterFile: path.resolve(`logs/counter`)
        },
        ttt: {
            databaseFile: path.resolve("ttt.db"),
            enable: false
        }
    };

module.exports = {
    constants
};