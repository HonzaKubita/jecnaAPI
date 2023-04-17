const {payloadIsType, tokenValid} = require("../../../modules/checker");
const {getSafeStringField, documentOf} = require("../../../modules/utils");
const {jecnaAuthRequest, jecnaDataPost} = require("../../../modules/http");
const {PayloadException} = require("../../../exceptions/client/payloadException");
module.exports = {
    put: async (req, res, next) => {
        payloadIsType(req.headers);

        const token = getSafeStringField(req.body.token, "token");
        const oldPassword = getSafeStringField(req.body.oldPassword, "oldPassword");
        const newPassword = getSafeStringField(req.body.newPassword, "newPassword");

        const passwordBaseRes = await jecnaAuthRequest("/user/change-password", token);
        tokenValid(passwordBaseRes.data);

        const formForm = documentOf(passwordBaseRes.data).getElementById("passwordForm");
        const token1 = formForm.children[0].value;
        const token2 = formForm.children[1].value;

        const passwordUploadRes = await jecnaDataPost("/user/change-password", token, {
            token1: token1,
            token2: token2,
            oldpass: oldPassword,
            pass: newPassword,
            passre: newPassword
        });

        // resolve errors
        const errorUls = documentOf(passwordUploadRes.data).getElementsByClassName("errors");
        if (errorUls.length > 0) {
            const errorMessages = [];
            for (const errorUl of errorUls) {
                for (const errorLi of errorUl.children) {
                    errorMessages.push(errorLi.innerHTML);
                }
            }
            const err = new PayloadException("Some of the fields have wrong value!");
            err.errors = errorMessages;
            throw err;
        }

        res.status(201).send({
            password: newPassword
        });
        next();
    }
}