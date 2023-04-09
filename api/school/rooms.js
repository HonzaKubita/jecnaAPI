const {payloadIsType, tokenValid} = require("../../modules/checker");
const {jecnaAuthRequest} = require("../../modules/http");
const {roomsParser} = require("../../parsers/school/roomsParser");
const {getSafeField} = require("../../modules/utils");
module.exports = {
    post: async (req,res) => {
        payloadIsType(req.headers);

        const token = getSafeField(req.body.token, "token");

        const roomsRes = await jecnaAuthRequest("/room/list", token);
        tokenValid(roomsRes.data);

        const roomsJSON = roomsParser(roomsRes.data);
        res.status(200).json(roomsJSON);
    }
}