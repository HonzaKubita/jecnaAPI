const {payloadIsType, getSafeBooleanField} = require("../../modules/checker");
const {foodRequest} = require("../../modules/http");
const {foodParser} = require("../../parsers/school/food");
module.exports = {
    post: async (req, res) => {
        payloadIsType(req.headers);

        const list = getSafeBooleanField(req.body.list, "list", true);

        const foodRes = await foodRequest({
            method: "GET",
            url: "/faces/login.jsp"
        });

        const foodJSON = foodParser(foodRes.data, list);
        res.status(200).json(foodJSON);
    }
}