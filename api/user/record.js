const {tokenValid, siteFound} = require("../../modules/checker");
const {getSafeNumberField, getToken} = require("../../modules/utils");
const {jecnaAuthRequest} = require("../../modules/http");
const {recordParser} = require("../../parsers/user/recordParser");
module.exports = {
    get: async (req, res, next) => {
        const token = getToken(req, true);
        const id = getSafeNumberField(req.body?.id, "id");

        const recordRes = await jecnaAuthRequest(`/user-student/record?userStudentRecordId=${id}`, token);
        tokenValid(recordRes.data);
        siteFound(recordRes.data, `Record ${id}`);

        const recordJSON = recordParser(recordRes.data);
        res.status(200).json(recordJSON);
        next();
    }
};