const {getSafeField} = require("../modules/checker");
const {jecnaAuthRequest} = require("../modules/http");
module.exports = {
    post: async (req, res) => {
        const token = getSafeField(req.body.token, "token");
        await jecnaAuthRequest("/user/logout", token);
        res.status(200).json({});
    }
}