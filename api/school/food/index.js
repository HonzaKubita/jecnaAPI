const {payloadIsType} = require("../../../modules/checker");
const {foodRequest} = require("../../../modules/http");
const {foodParser} = require("../../../parsers/school/foodParser");
const {getSafeBooleanField} = require("../../../modules/utils");
module.exports = {
    post: async (req, res, next) => {
        payloadIsType(req.headers);

        const list = getSafeBooleanField(req.body.list, "list", true);

        const foodRes = await foodRequest({
            method: "GET",
            url: "/faces/login.jsp"
        });

        const foodJSON = foodParser(foodRes.data, list);
        res.status(200).json(foodJSON);
        next();
    }
}