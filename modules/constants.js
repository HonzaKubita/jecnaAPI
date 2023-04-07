const constants =
{
    repo: "https://github.com/HonzaKubita/jecnaAPI",
    server: {
        port: 3000
    },
    jecna: {
        baseURL: "https://www.spsejecna.cz",
        sessionCookieName: "JSESSIONID",
        tokenCheckerString: "Pro pokračování se přihlaste do systému"
    },
    food: {
        baseURL: "https://objednavky.jidelnasokolska.cz",
        sessionCookieName: "JSESSIONID",
        tokenCookieName: "XSRF-TOKEN"
    }
};

module.exports = {
    constants
}