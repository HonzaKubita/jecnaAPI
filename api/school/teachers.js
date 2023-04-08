const {jecnaAuthRequest} = require("../../modules/http");
const {constants} = require("../../modules/constants");
const {teachersParser} = require("../../parsers/school/teachersParser");
module.exports = {
    post: async (req, res) => {
        const teachersRes = await jecnaAuthRequest("/ucitel", constants.jecna.wrongToken);

        const teachersJSON = teachersParser(teachersRes.data);
        res.status(200).json(teachersJSON);
    }
}