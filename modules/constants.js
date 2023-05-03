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
            logsFolder: `${__dirname}/../logs`,
            fullLogsFolder: `${__dirname}/../logs/full`,
            counterFile: `${__dirname}/../logs/counter`
        },
        ttt: {
            databaseFile: `${__dirname}/../ttt.db`,
            enable: true
        }
    };

module.exports = {
    constants
};