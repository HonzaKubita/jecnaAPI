const constants =
{
    repo: "https://github.com/HonzaKubita/jecnaAPI",
    server: {
        port: 3000
    },
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
    }
};

module.exports = {
    constants
}