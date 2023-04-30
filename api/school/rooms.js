const {tokenValid} = require("../../modules/checker");
const {jecnaAuthRequest} = require("../../modules/http");
const {roomsParser} = require("../../parsers/school/roomsParser");
const {getToken} = require("../../modules/utils");
module.exports = {
    get: async (req, res, next) => {
        const token = getToken(req, true);

        const roomsRes = await jecnaAuthRequest("/room/list", token);
        tokenValid(roomsRes.data);

        const roomsJSON = roomsParser(roomsRes.data);
        res.status(200).json(roomsJSON);
        next();
    }
};